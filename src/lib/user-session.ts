// src/lib/user-session.ts
//
// Subset de user-auth.ts que NO importa Prisma: solo las funciones criptográficas
// puras (Web Crypto). Se puede importar en Edge runtime (middleware.ts).
//
// Para funciones que necesitan DB (createMagicLinkToken, getCurrentUser, etc.)
// sigue usando src/lib/user-auth.ts desde Server Components / API routes.

export const SESSION_COOKIE = "xhz_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

// -----------------------------------------------------------------------------
// helpers
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
// Verifica el token de sesión del alumno.
// Formato del token: `${userId}.${issuedAt}.${hmacHex}`
// -----------------------------------------------------------------------------

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
