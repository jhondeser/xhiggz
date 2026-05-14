// src/components/checkout/BuyButton.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";

type CoursePlan = "monthly" | "yearly";

interface BuyButtonProps {
  /** Slug del curso */
  slug: string;
  /** Modalidad: mensual recurring o anual one-time */
  plan: CoursePlan;
  /** Texto del botón (sensato según el plan si se omite) */
  label?: string;
  /** Estilo del botón */
  variant?: "primary" | "white" | "ghost";
  /** className extra para el botón */
  className?: string;
  /** Para tracking opcional (queda en el Lead) */
  source?: string;
}

const buttonStyles: Record<NonNullable<BuyButtonProps["variant"]>, string> = {
  primary:
    "group w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 sm:py-4 px-5 sm:px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 sm:hover:scale-105 inline-flex items-center justify-center gap-3 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed",
  white:
    "w-full bg-white text-cyan-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
  ghost:
    "w-full bg-cyan-700/40 hover:bg-cyan-700/60 backdrop-blur-sm text-white font-bold py-4 rounded-2xl border border-white/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
};

export default function BuyButton({
  slug,
  plan,
  label,
  variant = "primary",
  className = "",
  source,
}: BuyButtonProps) {
  const [open, setOpen] = useState(false);

  const defaultLabel =
    plan === "monthly" ? "📅 Suscríbete mensual" : "🎓 Acceso 1 año";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${buttonStyles[variant]} ${className}`}
      >
        <span>{label ?? defaultLabel}</span>
        {variant === "primary" && (
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        )}
      </button>

      {open && (
        <CheckoutDialog
          slug={slug}
          plan={plan}
          source={source}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// =============================================================================
// Dialog: pide email + nombre y dispara /api/checkout
// =============================================================================

interface CheckoutDialogProps {
  slug: string;
  plan: CoursePlan;
  source?: string;
  onClose: () => void;
}

function CheckoutDialog({ slug, plan, source, onClose }: CheckoutDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // SSR safe: document sólo existe en el cliente.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Bloquea el scroll del body mientras el modal está abierto.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Cerrar con tecla Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          plan,
          email: email.trim(),
          name: name.trim() || undefined,
          source,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "No pudimos iniciar el pago. Intenta de nuevo.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  const planLabel = plan === "monthly" ? "Suscripción mensual" : "Acceso por 1 año";

  // Hasta que el componente esté montado en el cliente, no podemos usar Portal.
  if (!mounted) return null;

  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-dialog-title"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 id="checkout-dialog-title" className="text-2xl font-bold text-gray-900">
          Confirma tu compra
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {planLabel}. Te llevamos a un pago seguro con Stripe.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="checkout-name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nombre (opcional)
            </label>
            <input
              id="checkout-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="tu@email.com"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirigiendo a Stripe…
              </>
            ) : (
              <>Continuar al pago →</>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Pago seguro procesado por Stripe. No guardamos tu tarjeta.
          </p>
        </form>
      </div>
    </div>
  );

  // Renderizamos en document.body para escapar de cualquier stacking context
  // creado por motion.div, transform, filter, etc. en los ancestros.
  return createPortal(dialog, document.body);
}
