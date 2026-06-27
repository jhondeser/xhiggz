// src/middleware.ts
// Admin routes: sesion custom HMAC (admin-auth.ts)
// Student routes: NextAuth JWT (getToken de next-auth/jwt)

import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  SESSION_COOKIE as ADMIN_COOKIE,
  verifySessionToken as verifyAdmin,
} from "@/lib/admin-auth";

const ADMIN_PUBLIC = new Set(["/admin/login", "/api/admin/login"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (ADMIN_PUBLIC.has(pathname)) return NextResponse.next();

    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) return NextResponse.json({ error: "ADMIN_SESSION_SECRET no definido" }, { status: 500 });

    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (await verifyAdmin(token, secret)) return NextResponse.next();

    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const url = new URL("/admin/login", req.url);
    if (pathname !== "/admin") url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Student area
  if (pathname.startsWith("/mis-cursos") || pathname.startsWith("/mi-cuenta")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) return NextResponse.next();

    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/mis-cursos/:path*", "/mi-cuenta/:path*"],
};
