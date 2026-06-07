// src/app/checkout/cancel/page.tsx
//
// El usuario llegó aquí porque pulsó "Volver" en Stripe Checkout.
// No es un error: simplemente no terminó el pago.

import Link from "next/link";
import type { Metadata } from "next";
import { XCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Pago cancelado · xhiggs",
  description: "No se realizó ningún cargo. Puedes volver a intentarlo cuando quieras.",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 sm:p-12 shadow-2xl border border-gray-100 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <XCircle className="h-12 w-12 text-amber-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Pago cancelado
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            No se realizó ningún cargo. Puedes volver a intentarlo cuando estés
            listo.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            ¿Tuviste un problema con el pago? Escríbenos y lo resolvemos.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a los cursos
            </Link>

            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-cyan-400 hover:text-cyan-600 transition-all"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
