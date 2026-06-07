// src/app/api/auth/request-magic-link/route.ts
//
// POST /api/auth/request-magic-link
// Body: { email: string, from?: string }
//
// 1. Valida email.
// 2. Crea un VerificationToken (hash + email + redirectTo + expira en 15 min).
// 3. Llama al webhook de n8n con { to, link, expiresInMinutes }.
// 4. n8n se encarga del email real (Gmail SMTP) — Next.js solo genera el link.

import { NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/user-auth";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const from =
    typeof body.from === "string" && body.from.startsWith("/")
      ? body.from
      : null;

  if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  const email = rawEmail.toLowerCase();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_BASE_URL no está definido" },
      { status: 500 },
    );
  }

  const n8nUrl = process.env.N8N_MAGIC_LINK_URL;
  if (!n8nUrl) {
    return NextResponse.json(
      { error: "Magic-link delivery no configurado" },
      { status: 500 },
    );
  }

  const rawToken = await createMagicLinkToken(email, from);
  const link = `${baseUrl}/api/auth/verify?token=${rawToken}`;

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (process.env.N8N_WEBHOOK_SECRET) {
    headers["x-xhiggs-secret"] = process.env.N8N_WEBHOOK_SECRET;
  }

  try {
    const res = await fetch(n8nUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        to: email,
        link,
        expiresInMinutes: 15,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `[magic-link] n8n respondió ${res.status}: ${detail.slice(0, 200)}`,
      );
      return NextResponse.json(
        { error: "No se pudo enviar el email" },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[magic-link] error llamando a n8n", err);
    return NextResponse.json(
      { error: "No se pudo enviar el email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
