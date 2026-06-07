// src/app/api/auth/verify/route.ts
//
// GET /api/auth/verify?token=<rawToken>
//
// 1. Consume el token (single-use).
// 2. Upsert del User por email — si no existía, lo creamos sin password.
// 3. Setea cookie de sesión firmada.
// 4. Redirect al destino (`redirectTo` del token o "/" por defecto).

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  MAX_AGE_SECONDS,
  SESSION_COOKIE,
  consumeMagicLinkToken,
  makeSessionToken,
} from "@/lib/user-auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=missing-token", url.origin),
    );
  }

  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "AUTH_SESSION_SECRET no está definido" },
      { status: 500 },
    );
  }

  const result = await consumeMagicLinkToken(token);
  if (!result) {
    return NextResponse.redirect(
      new URL("/login?error=invalid-or-expired", url.origin),
    );
  }

  // Upsert User. Si nunca pagó, se le crea cuenta sin más — el gating de
  // acceso a cursos se hace a nivel de Enrollment, no de User.
  const user = await prisma.user.upsert({
    where: { email: result.email },
    create: {
      email: result.email,
      name: "Alumno",
    },
    update: {},
  });

  const sessionToken = await makeSessionToken(user.id, secret);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  // Solo aceptamos redirects relativos (que empiecen por "/") para evitar
  // open-redirect a sitios externos.
  const redirectTo =
    result.redirectTo && result.redirectTo.startsWith("/")
      ? result.redirectTo
      : "/";

  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
