// src/app/api/checkout/route.ts
//
// POST /api/checkout
// Body: { slug: string, plan: 'monthly'|'yearly', email: string, name?: string,
//         source?, utm* }
// Resp: { url: string }   ← URL absoluta de Stripe Checkout para redirigir al usuario

import { NextResponse } from "next/server";
import { createCourseCheckout } from "@/server/checkout";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface CheckoutRequestBody {
  slug?: string;
  plan?: string;
  email?: string;
  name?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { slug, plan, email, name } = body;

  if (!slug) {
    return NextResponse.json({ error: "slug requerido" }, { status: 400 });
  }

  if (plan !== "monthly" && plan !== "yearly") {
    return NextResponse.json(
      { error: "plan debe ser 'monthly' o 'yearly'" },
      { status: 400 },
    );
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // Lead — registramos aunque no termine el pago, para tener pista de
  // remarketing si el usuario abandona el checkout. Si el mismo email
  // vuelve al mismo curso, hacemos UPSERT (no duplicamos): actualizamos
  // los campos por si llegan utms o nombre nuevos.
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (course) {
      await prisma.lead.upsert({
        where: { email_courseId: { email, courseId: course.id } },
        create: {
          email,
          name: name ?? null,
          source: body.source ?? `course-${plan}`,
          courseId: course.id,
          utmSource: body.utmSource ?? null,
          utmMedium: body.utmMedium ?? null,
          utmCampaign: body.utmCampaign ?? null,
        },
        update: {
          // Solo sobrescribimos si llega un valor nuevo: respetamos lo que
          // ya tuviéramos guardado de visitas anteriores.
          ...(name ? { name } : {}),
          ...(body.source ? { source: body.source } : {}),
          ...(body.utmSource ? { utmSource: body.utmSource } : {}),
          ...(body.utmMedium ? { utmMedium: body.utmMedium } : {}),
          ...(body.utmCampaign ? { utmCampaign: body.utmCampaign } : {}),
        },
      });
    } else {
      // Si no hay curso (no debería pasar — slug ya validado arriba),
      // creamos Lead suelto. Aquí no podemos deduplicar por (email,courseId).
      await prisma.lead.create({
        data: {
          email,
          name: name ?? null,
          source: body.source ?? `course-${plan}`,
          courseId: null,
          utmSource: body.utmSource ?? null,
          utmMedium: body.utmMedium ?? null,
          utmCampaign: body.utmCampaign ?? null,
        },
      });
    }
  } catch (err) {
    console.error("[checkout] no se pudo crear Lead", err);
  }

  try {
    const result = await createCourseCheckout({
      slug,
      plan,
      customerEmail: email,
      customerName: name,
    });

    return NextResponse.json({ url: result.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[checkout] fallo creando sesión Stripe", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
