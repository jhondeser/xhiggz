// src/app/api/admin/login/route.ts
//
// POST /api/admin/login
// Body: { password: string }
// Si coincide con ADMIN_PASSWORD, setea cookie firmada y devuelve { ok: true }.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  MAX_AGE_SECONDS,
  SESSION_COOKIE,
  makeSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Admin no configurado en el servidor" },
      { status: 500 },
    );
  }

  if (!verifyPassword(password, expected)) {
    return NextResponse.json({ error: "Password incorrecto" }, { status: 401 });
  }

  const token = await makeSessionToken(secret);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}
