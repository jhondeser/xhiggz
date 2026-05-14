// src/app/checkout/success/page.tsx
//
// Página de retorno tras pago exitoso. NO concede acceso (eso lo hace el
// webhook); sólo confirma visualmente al usuario.

import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { retrieveCheckoutSession } from "@/server/checkout";

export const metadata: Metadata = {
  title: "¡Pago confirmado! · Xhiggz",
  description: "Gracias por tu compra. Te enviamos los próximos pasos por email.",
};

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let mode: string | null = null;
  let amount: number | null = null;
  let currency: string | null = null;

  if (session_id) {
    try {
      const session = await retrieveCheckoutSession(session_id);
      email = session.customer_details?.email ?? session.customer_email ?? null;
      mode = session.mode;
      amount = session.amount_total ?? null;
      currency = session.currency ?? null;
    } catch (err) {
      // Si no podemos recuperar la sesión, mostramos la pantalla genérica.
      console.warn("[checkout/success] no se pudo recuperar la sesión", err);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 sm:p-12 shadow-2xl border border-gray-100 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            ¡Pago confirmado!
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            {mode === "subscription"
              ? "Tu suscripción al catálogo Xhiggz está activa."
              : "Tu inscripción quedó registrada."}
          </p>

          {amount && currency && (
            <p className="mt-4 text-sm text-gray-500">
              Importe cobrado:{" "}
              <span className="font-semibold text-gray-700">
                {(amount / 100).toFixed(2)} {currency.toUpperCase()}
              </span>
            </p>
          )}

          <div className="mt-8 rounded-2xl bg-cyan-50 p-5 text-left">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  Revisa tu email
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {email
                    ? `Te enviamos un correo a ${email} con el acceso y los pasos para entrar al curso.`
                    : "Te enviamos un correo con el acceso y los pasos para entrar al curso."}{" "}
                  Si no aparece en bandeja de entrada, revisa Spam/Promociones.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all"
            >
              Ver todos los cursos
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-cyan-400 hover:text-cyan-600 transition-all"
            >
              Necesito ayuda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
