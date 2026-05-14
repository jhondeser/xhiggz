// src/middleware.ts
//
// Protege /admin/* y /api/admin/* salvo las rutas públicas de login.
// Corre en Edge runtime, por eso admin-auth.ts usa Web Crypto.

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

const PUBLIC_PATHS = new Set<string>([
  "/admin/login",
  "/api/admin/login",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SESSION_SECRET no está definido en el servidor" },
      { status: 500 },
    );
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token, secret);

  if (valid) return NextResponse.next();

  // API → 401 limpio.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Página → redirect a /admin/login conservando destino.
  const loginUrl = new URL("/admin/login", req.url);
  if (pathname !== "/admin") {
    loginUrl.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
