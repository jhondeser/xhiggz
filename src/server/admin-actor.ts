// src/server/admin-actor.ts
//
// Las server actions del admin son endpoints POST: no basta con que el
// middleware proteja la página, cada acción vuelve a verificar la cookie.

import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export async function requireAdminActor(): Promise<{ kind: "admin" }> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !(await verifySessionToken(token, secret))) {
    throw new Error("No autorizado");
  }
  return { kind: "admin" };
}
