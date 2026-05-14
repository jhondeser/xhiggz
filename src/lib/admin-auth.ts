// src/lib/admin-auth.ts
//
// Helpers de autenticación del admin. Usa Web Crypto (no node:crypto) para que
// funcione tanto en runtime Node (API routes) como en Edge (middleware).
//
// Variables de entorno requeridas:
//   ADMIN_PASSWORD          - el password único para entrar al admin
//   ADMIN_SESSION_SECRET    - string aleatorio largo (>= 32 chars) para firmar la cookie

export const SESSION_COOKIE = "xhz_admin";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

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

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/**
 * Comparación en tiempo (semi) constante de password.
 * No es estrictamente time-constant en JS por JIT, pero suficiente para un
 * password único de admin con bajo tráfico.
 */
export function verifyPassword(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    result |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Genera un token de sesión: `<issuedAt>.<hmacHex>`
 */
export async function makeSessionToken(secret: string): Promise<string> {
  const issuedAt = Date.now();
  const payload = String(issuedAt);
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${bufToHex(sig)}`;
}

/**
 * Verifica un token: firma válida + dentro del MAX_AGE.
 */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const issuedAt = Number(payload);
  if (Number.isNaN(issuedAt)) return false;
  const ageSeconds = (Date.now() - issuedAt) / 1000;
  if (ageSeconds > MAX_AGE_SECONDS) return false;

  try {
    const key = await getKey(secret);
    const sigBuf = hexToBuf(signature);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf,
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}
