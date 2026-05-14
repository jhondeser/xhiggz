// src/lib/stripe-config.ts
//
// Configuración global de pagos. Las decisiones por curso (qué price
// corresponde a cada modalidad) viven en la tabla Course de la BD:
// Course.stripePriceIdMonthly y Course.stripePriceIdYearly.

export const STRIPE_CURRENCY = "eur";

/** Plan que el usuario elige al comprar un curso */
export type CoursePlan = "monthly" | "yearly";

/**
 * Cuántos días de acceso da el plan anual one-time.
 * Si después quieres "365 días desde la compra" o "hasta el 31 dic" cámbialo aquí.
 */
export const YEARLY_ACCESS_DAYS = 365;

/** Base URL absoluta para construir success_url y cancel_url. */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL no está definido. Necesario para los redirect de Stripe.",
    );
  }
  return url.replace(/\/$/, "");
}

/** URLs canónicas de retorno tras el checkout. */
export function getCheckoutReturnUrls() {
  const base = getBaseUrl();
  return {
    success: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel: `${base}/checkout/cancel`,
  };
}
