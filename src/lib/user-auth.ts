// src/lib/user-auth.ts
//
// Auth de alumnos (cliente final): sesión por cookie HMAC + magic link tokens.
// Usa Web Crypto para que el mismo módulo funcione en Node (API routes / Server
// Components) y en Edge (middleware si lo añadimos en el futuro).
//
// Variables de entorno requeridas:
//   AUTH_SESSION_SECRET    - string aleatorio (>= 32 chars) para firmar la cookie de sesión

import { prisma } from "./prisma";

export const SESSION_COOKIE = "xhz_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días
export const MAGIC_LINK_TTL_SECONDS = 60 * 15; // 15 min

// -----------------------------------------------------------------------------
// helpers binarios
// -----------------------------------------------------------------------------

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes.buffer;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// -----------------------------------------------------------------------------
// Session token (cookie xhz_session)
// Formato: `${userId}.${issuedAt}.${hmacHex}`
// La firma cubre `${userId}.${issuedAt}`.
// -----------------------------------------------------------------------------

export async function makeSessionToken(
  userId: number,
  secret: string,
): Promise<string> {
  const issuedAt = Date.now();
  const payload = `${userId}.${issuedAt}`;
  const key = await getHmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${bufToHex(sig)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
): Promise<{ userId: number } | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userIdStr, issuedAtStr, signature] = parts;

  const userId = Number(userIdStr);
  const issuedAt = Number(issuedAtStr);
  if (Number.isNaN(userId) || Number.isNaN(issuedAt)) return null;

  const ageSeconds = (Date.now() - issuedAt) / 1000;
  if (ageSeconds > MAX_AGE_SECONDS) return null;

  try {
    const key = await getHmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBuf(signature),
      new TextEncoder().encode(`${userIdStr}.${issuedAtStr}`),
    );
    return valid ? { userId } : null;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Magic link tokens (tabla VerificationToken)
// Se guarda el HASH del token, no el token en sí. Cada token es de un solo uso.
// -----------------------------------------------------------------------------

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return bufToHex(buf);
}

function randomTokenHex(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bufToHex(bytes.buffer);
}

export async function createMagicLinkToken(
  email: string,
  redirectTo: string | null,
): Promise<string> {
  const rawToken = randomTokenHex(32);
  const tokenHash = await sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_SECONDS * 1000);

  await prisma.verificationToken.create({
    data: {
      tokenHash,
      email: email.toLowerCase(),
      redirectTo,
      expiresAt,
    },
  });

  return rawToken;
}

export async function consumeMagicLinkToken(
  rawToken: string,
): Promise<{ email: string; redirectTo: string | null } | null> {
  const tokenHash = await sha256Hex(rawToken);

  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash },
  });
  if (!record) return null;

  // Borramos siempre (incluso si está expirado: limpieza)
  await prisma.verificationToken
    .delete({ where: { id: record.id } })
    .catch(() => {});

  if (record.expiresAt < new Date()) return null;

  return { email: record.email, redirectTo: record.redirectTo };
}

// -----------------------------------------------------------------------------
// Helper para Server Components: lee la cookie y devuelve el User o null
// -----------------------------------------------------------------------------

export async function getCurrentUser() {
  // import dinámico para que esto solo se cargue en server.
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) return null;

  const session = await verifySessionToken(token, secret);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}
