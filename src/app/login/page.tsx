"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function errorMessageFromParam(error: string | null): string | null {
  if (error === "invalid-or-expired")
    return "El enlace expiró o ya se había usado. Pide uno nuevo.";
  if (error === "missing-token") return "El enlace no es válido.";
  return null;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const initialError = errorMessageFromParam(searchParams.get("error"));

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"form" | "sent">("form");
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/request-magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, from }),
      });
      if (res.ok) {
        setState("sent");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "No se pudo enviar el enlace");
      }
    } catch {
      setErrorMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  if (state === "sent") {
    return (
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 border border-slate-800 text-slate-100">
        <div className="text-emerald-400 text-3xl mb-3">✉</div>
        <h1 className="text-2xl font-semibold mb-2">Revisa tu email</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Te hemos enviado un enlace a{" "}
          <span className="text-slate-200 font-medium">{email}</span>. Caduca en
          15 minutos. Si no lo ves en unos segundos, revisa la carpeta de spam.
        </p>
        <button
          onClick={() => {
            setState("form");
            setEmail("");
            setErrorMsg(null);
          }}
          className="mt-6 text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Usar otro email
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 border border-slate-800 text-slate-100"
    >
      <h1 className="text-2xl font-semibold mb-2">Entrar a xhiggs</h1>
      <p className="text-slate-400 text-sm mb-6">
        Te enviaremos un enlace mágico al email. Sin passwords ni formularios.
      </p>

      <label className="block mb-4">
        <span className="block text-sm text-slate-300 mb-2">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
          placeholder="tu@email.com"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </label>

      {errorMsg && (
        <div className="mb-4 text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2 transition"
      >
        {loading ? "Enviando…" : "Enviarme enlace"}
      </button>

      <p className="text-slate-500 text-xs mt-6 text-center">
        ¿Aún no compraste un curso?{" "}
        <Link href="/cursos" className="text-slate-300 hover:text-slate-100 underline">
          Explora el catálogo
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
