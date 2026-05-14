// src/app/api/webhooks/stripe/route.ts
//
// POST /api/webhooks/stripe
//
// 1. Verifica la firma (rechaza si no viene de Stripe).
// 2. Idempotencia: guarda event.id en StripeEvent. Si ya existe, salimos OK.
// 3. Despacha por tipo de evento → upsert de Order/Subscription/Enrollment.
// 4. Fan-out opcional a n8n vía N8N_WEBHOOK_URL.
//
// Modelo de pagos: cada curso tiene 2 prices en Stripe.
//   - plan='yearly'  → checkout mode='payment'      → Order one-time, Enrollment 365 días
//   - plan='monthly' → checkout mode='subscription' → Subscription, Enrollment renovado
//                                                     mientras la sub esté activa
//
// IMPORTANTE: este endpoint es la fuente de verdad para conceder acceso.
// Nunca conceder acceso desde el redirect post-checkout.

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { YEARLY_ACCESS_DAYS } from "@/lib/stripe-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta stripe-signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET no configurado");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "signature verification failed";
    console.warn("[stripe-webhook] firma inválida:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  console.log(`[stripe-webhook] recibido ${event.type} id=${event.id}`);

  // Idempotencia: si ya procesamos este event.id, devolvemos 200 sin hacer nada.
  const existing = await prisma.stripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing) {
    console.log(`[stripe-webhook] duplicado, ignorando ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`[stripe-webhook] evento ignorado: ${event.type}`);
    }

    await prisma.stripeEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        payload: JSON.parse(JSON.stringify(event)),
      },
    });

    void notifyN8n(event).catch((err) => {
      console.error("[stripe-webhook] fan-out a n8n falló", err);
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[stripe-webhook] error procesando ${event.type}`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "internal error" },
      { status: 500 },
    );
  }
}

// =============================================================================
// Handlers por tipo de evento
// =============================================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const plan = session.metadata?.plan;
  const courseIdRaw = session.metadata?.courseId;
  const email = session.customer_details?.email ?? session.customer_email;

  console.log(
    `[stripe-webhook] handleCheckoutCompleted session=${session.id} ` +
      `plan=${plan} courseId=${courseIdRaw} email=${email} ` +
      `payment_status=${session.payment_status} mode=${session.mode}`,
  );

  if (!email) {
    console.warn("[stripe-webhook] checkout.session.completed sin email — abortando");
    return;
  }
  if (!courseIdRaw) {
    console.warn(`[stripe-webhook] session ${session.id} sin courseId en metadata — abortando`);
    return;
  }
  const courseId = Number.parseInt(courseIdRaw, 10);
  if (Number.isNaN(courseId)) {
    console.warn(`[stripe-webhook] courseId no numérico: ${courseIdRaw}`);
    return;
  }

  // Upsert del User (sin password — se activa después por email).
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name:
        session.customer_details?.name ??
        session.metadata?.customerName ??
        "Cliente",
      stripeCustomerId:
        typeof session.customer === "string" ? session.customer : null,
    },
    update: {
      stripeCustomerId:
        typeof session.customer === "string" ? session.customer : undefined,
      ...(session.customer_details?.name
        ? { name: session.customer_details.name }
        : {}),
    },
  });

  console.log(`[stripe-webhook] User upserted id=${user.id} email=${email}`);

  if (plan === "yearly") {
    await processYearlyOrder(session, user.id, email, courseId);
    console.log(`[stripe-webhook] processYearlyOrder completado para ${email}`);
  } else if (plan === "monthly") {
    // Stripe envía customer.subscription.created ANTES que checkout.session.completed.
    // Si esperáramos a ese evento, no encontraría el User (que se crea aquí) y se
    // perdería. Recuperamos la subscription de Stripe directamente y la procesamos
    // en este mismo handler — así somos inmunes al orden de eventos.
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      console.warn(
        `[stripe-webhook] session monthly ${session.id} sin subscription id`,
      );
      return;
    }

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    await processSubscription(sub, user.id, courseId);
    console.log(
      `[stripe-webhook] processSubscription completado para ${email} sub=${sub.id}`,
    );
  } else {
    console.warn(`[stripe-webhook] session ${session.id} sin plan reconocido: ${plan}`);
  }
}

async function processYearlyOrder(
  session: Stripe.Checkout.Session,
  userId: number,
  email: string,
  courseId: number,
) {
  const isPaid = session.payment_status === "paid";
  const paidAt = isPaid ? new Date() : null;
  const expiresAt = paidAt
    ? new Date(paidAt.getTime() + YEARLY_ACCESS_DAYS * 24 * 60 * 60 * 1000)
    : null;

  console.log(
    `[stripe-webhook] processYearlyOrder isPaid=${isPaid} amount=${session.amount_total} sessionId=${session.id}`,
  );

  const order = await prisma.order.upsert({
    where: { stripeSessionId: session.id },
    create: {
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      userId,
      customerEmail: email,
      courseId,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
      status: isPaid ? "PAID" : "PENDING",
      paidAt,
    },
    update: {
      status: isPaid ? "PAID" : "PENDING",
      paidAt,
    },
  });

  console.log(
    `[stripe-webhook] Order upserted id=${order.id} status=${order.status}`,
  );

  if (order.status !== "PAID") {
    console.log(`[stripe-webhook] Order ${order.id} no está PAID, no creo Enrollment`);
    return;
  }

  // Enrollment YEARLY (one-time) → expira en 365 días.
  // Si el usuario ya tenía una SUBSCRIPTION para este curso, la "yearly"
  // gana en expiresAt: extendemos el acceso al máximo entre los dos.
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { expiresAt: true },
  });

  const finalExpiresAt = pickLatest(existing?.expiresAt, expiresAt);

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      source: "ONE_TIME",
      status: "ACTIVE",
      orderId: order.id,
      expiresAt: finalExpiresAt,
    },
    update: {
      source: "ONE_TIME",
      status: "ACTIVE",
      orderId: order.id,
      expiresAt: finalExpiresAt,
    },
  });

  console.log(
    `[stripe-webhook] Enrollment ONE_TIME upserted user=${userId} course=${courseId} expiresAt=${finalExpiresAt?.toISOString() ?? "null"}`,
  );
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Una invoice de subscription pagada no aporta info nueva — el evento
  // customer.subscription.updated ya nos da currentPeriodEnd actualizado.
  console.log(`[stripe-webhook] invoice.paid ${invoice.id}`);
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // 1) Buscar User por stripeCustomerId (caso normal: ya pasó por checkout).
  let user = await prisma.user.findUnique({ where: { stripeCustomerId } });

  // 2) Fallback: si no lo encontramos, puede ser que llegue antes de
  // checkout.session.completed (orden de eventos). Recuperamos el customer
  // de Stripe para obtener el email y buscar User por ahí.
  if (!user) {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (customer.deleted) {
      console.warn(
        `[stripe-webhook] customer ${stripeCustomerId} eliminado en Stripe`,
      );
      return;
    }
    const email = customer.email;
    if (!email) {
      console.warn(
        `[stripe-webhook] subscription ${sub.id} customer ${stripeCustomerId} sin email`,
      );
      return;
    }
    user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Aún no existe. Lo creamos aquí para no perder el evento. Se completará
      // cuando llegue checkout.session.completed.
      user = await prisma.user.create({
        data: {
          email,
          name: customer.name ?? "Cliente",
          stripeCustomerId,
        },
      });
      console.log(
        `[stripe-webhook] User creado on-demand desde subscription user=${user.id} email=${email}`,
      );
    } else if (!user.stripeCustomerId) {
      // Existe pero sin stripeCustomerId — lo enlazamos.
      user = await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }
  }

  // Resolver courseId: 1) metadata.courseId; 2) lookup por stripePriceIdMonthly.
  const priceId = sub.items.data[0]?.price.id ?? "";
  let courseId: number | null = null;

  const metaCourseId = sub.metadata?.courseId;
  if (metaCourseId) {
    const parsed = Number.parseInt(metaCourseId, 10);
    if (!Number.isNaN(parsed)) courseId = parsed;
  }
  if (courseId === null && priceId) {
    const course = await prisma.course.findFirst({
      where: { stripePriceIdMonthly: priceId },
      select: { id: true },
    });
    courseId = course?.id ?? null;
  }
  if (courseId === null) {
    console.warn(
      `[stripe-webhook] subscription ${sub.id} sin courseId resoluble (price=${priceId})`,
    );
    return;
  }

  await processSubscription(sub, user.id, courseId);
}

/**
 * Hace upsert de Subscription en BD + sync del Enrollment correspondiente.
 * Centralizada para que tanto checkout.session.completed (monthly)
 * como customer.subscription.* la usen sin duplicar lógica.
 */
async function processSubscription(
  sub: Stripe.Subscription,
  userId: number,
  courseId: number,
) {
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const item = sub.items.data[0];
  const priceId = item?.price.id ?? "";
  const status = mapSubscriptionStatus(sub.status);

  // En la API de Stripe 2025-04+ (incluida 2026-04-22.dahlia que tienes
  // configurada), `current_period_start` y `current_period_end` se movieron
  // del Subscription al SubscriptionItem (para soportar items con ciclos
  // distintos). Leemos del item con fallback al objeto sub por compat.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subAny = sub as any;
  const periodStartUnix =
    item?.current_period_start ?? subAny.current_period_start;
  const periodEndUnix =
    item?.current_period_end ?? subAny.current_period_end;

  if (!periodStartUnix || !periodEndUnix) {
    console.error(
      `[stripe-webhook] subscription ${sub.id} sin current_period_start/end ` +
        `(item=${!!item}). No puedo guardar — abortando.`,
    );
    return;
  }

  const currentPeriodStart = new Date(periodStartUnix * 1000);
  const currentPeriodEnd = new Date(periodEndUnix * 1000);

  console.log(
    `[stripe-webhook] processSubscription sub=${sub.id} status=${status} ` +
      `user=${userId} course=${courseId} ` +
      `period=${currentPeriodStart.toISOString()}→${currentPeriodEnd.toISOString()}`,
  );

  const subscription = await prisma.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    create: {
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      stripeCustomerId,
      userId,
      courseId,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
    update: {
      stripePriceId: priceId,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
  });

  console.log(
    `[stripe-webhook] Subscription upserted id=${subscription.id} status=${subscription.status}`,
  );

  await syncMonthlyEnrollment(
    subscription.id,
    userId,
    courseId,
    status,
    subscription.currentPeriodEnd,
  );
}

async function syncMonthlyEnrollment(
  subscriptionId: number,
  userId: number,
  courseId: number,
  status: ReturnType<typeof mapSubscriptionStatus>,
  currentPeriodEnd: Date,
) {
  const isActive = status === "ACTIVE" || status === "TRIALING";
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { source: true, expiresAt: true },
  });

  if (isActive) {
    // Si ya tiene un Enrollment ONE_TIME (compró anual), no degradamos a
    // SUBSCRIPTION; sólo extendemos expiresAt si la sub renueva más allá.
    if (existing?.source === "ONE_TIME") {
      const extended = pickLatest(existing.expiresAt, currentPeriodEnd);
      if (extended && existing.expiresAt && extended > existing.expiresAt) {
        await prisma.enrollment.update({
          where: { userId_courseId: { userId, courseId } },
          data: { expiresAt: extended },
        });
      }
      return;
    }

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        source: "SUBSCRIPTION",
        status: "ACTIVE",
        subscriptionId,
        expiresAt: currentPeriodEnd,
      },
      update: {
        source: "SUBSCRIPTION",
        status: "ACTIVE",
        subscriptionId,
        expiresAt: currentPeriodEnd,
      },
    });
    console.log(
      `[stripe-webhook] Enrollment SUBSCRIPTION upserted user=${userId} course=${courseId} expiresAt=${currentPeriodEnd.toISOString()}`,
    );
  } else {
    // Sub cancelada/past_due → marcar EXPIRED sólo si el Enrollment vino de
    // ESTA suscripción (no tocar un ONE_TIME).
    await prisma.enrollment.updateMany({
      where: { subscriptionId, source: "SUBSCRIPTION" },
      data: { status: "EXPIRED" },
    });
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });
  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "REFUNDED", refundedAt: new Date() },
  });

  await prisma.enrollment.updateMany({
    where: { orderId: order.id },
    data: { status: "REFUNDED" },
  });
}

// =============================================================================
// Helpers
// =============================================================================

function mapSubscriptionStatus(s: Stripe.Subscription.Status) {
  switch (s) {
    case "trialing":           return "TRIALING" as const;
    case "active":             return "ACTIVE" as const;
    case "past_due":           return "PAST_DUE" as const;
    case "canceled":           return "CANCELED" as const;
    case "unpaid":             return "UNPAID" as const;
    case "incomplete":         return "INCOMPLETE" as const;
    case "incomplete_expired": return "INCOMPLETE_EXPIRED" as const;
    case "paused":             return "CANCELED" as const;
  }
}

/** Devuelve la fecha más tardía de las dos. null cuenta como "vitalicio" → gana. */
function pickLatest(a: Date | null | undefined, b: Date | null | undefined): Date | null {
  if (a == null && b == null) return null;
  if (a == null) return b ?? null;
  if (b == null) return a;
  return a > b ? a : b;
}

async function notifyN8n(event: Stripe.Event) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.N8N_WEBHOOK_SECRET) {
    headers["x-xhiggz-secret"] = process.env.N8N_WEBHOOK_SECRET;
  }

  await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: event.type,
      id: event.id,
      created: event.created,
      data: event.data,
    }),
  });
}
