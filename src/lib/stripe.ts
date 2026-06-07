// src/lib/stripe.ts
//
// Cliente Stripe server-side. Importarlo desde un client component fallaría
// en build (Stripe usa APIs de Node), así que sólo se usa en server actions,
// API routes y server components.
//
// La apiVersion se fija a propósito: si Stripe lanza una nueva versión,
// nuestro código sigue funcionando hasta que decidamos actualizar.

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY no está definido. Copia .env.example a .env y rellénalo.",
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
  appInfo: {
    name: "xhiggs",
    version: "0.1.0",
  },
});
