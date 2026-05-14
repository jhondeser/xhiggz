// src/server/checkout.ts
//
// Crea sesiones de Stripe Checkout. La modalidad (monthly/yearly) se decide
// en el cliente (qué botón pulsa el usuario) y aquí elegimos el price + mode
// adecuados:
//   - monthly  → Stripe price recurring + mode 'subscription'
//   - yearly   → Stripe price one-time   + mode 'payment'
//
// NUNCA concedemos acceso al curso aquí — el acceso se concede sólo cuando
// el webhook recibe checkout.session.completed o customer.subscription.*
// (el usuario podría cerrar la pestaña antes del redirect).

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCheckoutReturnUrls, type CoursePlan } from "@/lib/stripe-config";
import type Stripe from "stripe";

interface CreateCourseCheckoutInput {
  /** Slug del curso a comprar */
  slug: string;
  /** Plan elegido por el usuario */
  plan: CoursePlan;
  /** Email del comprador (lo necesitamos para enlazar Order/User) */
  customerEmail: string;
  /** Nombre opcional, para pre-rellenar el form de Stripe */
  customerName?: string;
}

/**
 * Crea una Stripe Checkout Session para un curso.
 * Devuelve la URL a la que hay que redirigir al usuario.
 */
export async function createCourseCheckout(
  input: CreateCourseCheckoutInput,
): Promise<{ url: string; sessionId: string }> {
  const course = await prisma.course.findUnique({
    where: { slug: input.slug },
    select: {
      id: true,
      slug: true,
      title: true,
      stripePriceIdMonthly: true,
      stripePriceIdYearly: true,
    },
  });

  if (!course) {
    throw new Error(`Curso no encontrado: ${input.slug}`);
  }

  const priceId =
    input.plan === "monthly"
      ? course.stripePriceIdMonthly
      : course.stripePriceIdYearly;

  if (!priceId) {
    throw new Error(
      `El curso "${course.slug}" no tiene un price ${input.plan} configurado en BD. ` +
        `Setea Course.stripePriceId${input.plan === "monthly" ? "Monthly" : "Yearly"}.`,
    );
  }

  const urls = getCheckoutReturnUrls();
  const isSubscription = input.plan === "monthly";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: isSubscription ? "subscription" : "payment",
    payment_method_types: ["card"],
    customer_email: input.customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      plan: input.plan,
      courseId: String(course.id),
      courseSlug: course.slug,
      customerName: input.customerName ?? "",
    },
    success_url: urls.success,
    cancel_url: urls.cancel,
    allow_promotion_codes: true,
  };

  // Replicamos la metadata en el objeto secundario (PaymentIntent o Subscription)
  // para que aparezca también en el dashboard de Stripe y en eventos posteriores.
  if (isSubscription) {
    sessionParams.subscription_data = {
      metadata: {
        courseId: String(course.id),
        courseSlug: course.slug,
        customerName: input.customerName ?? "",
      },
    };
  } else {
    sessionParams.payment_intent_data = {
      metadata: {
        courseId: String(course.id),
        courseSlug: course.slug,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Stripe no devolvió URL para la sesión de checkout");
  }

  return { url: session.url, sessionId: session.id };
}

/**
 * Lee una Checkout Session por ID (para mostrar info en /checkout/success).
 */
export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer", "subscription"],
  });
}
