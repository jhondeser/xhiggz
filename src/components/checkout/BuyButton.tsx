// src/components/checkout/BuyButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, X, Calendar, Clock, Users, ChevronLeft } from 'lucide-react'

type CoursePlan = 'monthly' | 'yearly'

interface BuyButtonProps {
  slug: string
  plan: CoursePlan
  label?: string
  variant?: 'primary' | 'white' | 'ghost'
  className?: string
  source?: string
}

const buttonStyles: Record<NonNullable<BuyButtonProps['variant']>, string> = {
  primary:
    'group w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 sm:py-4 px-5 sm:px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 sm:hover:scale-105 inline-flex items-center justify-center gap-3 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed',
  white:
    'w-full bg-white text-cyan-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'w-full bg-cyan-700/40 hover:bg-cyan-700/60 backdrop-blur-sm text-white font-bold py-4 rounded-2xl border border-white/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
}

export default function BuyButton({
  slug,
  plan,
  label,
  variant = 'primary',
  className = '',
  source,
}: BuyButtonProps) {
  const [open, setOpen] = useState(false)

  const defaultLabel =
    plan === 'monthly' ? '📅 Suscríbete mensual' : '🎓 Curso completo'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${buttonStyles[variant]} ${className}`}
      >
        <span>{label ?? defaultLabel}</span>
        {variant === 'primary' && (
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
  )
}

// =============================================================================
// Tipos
// =============================================================================

interface Group {
  id: number
  nombre: string
  dia: string
  franja: string
  horaInicio: string
  horaFin: string
  plazasTotal: number
  plazasOcupadas: number
}

// =============================================================================
// Dialog multi-paso
// =============================================================================

interface CheckoutDialogProps {
  slug: string
  plan: CoursePlan
  source?: string
  onClose: () => void
}

function CheckoutDialog({ slug, plan, source, onClose }: CheckoutDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)

  // Paso 1
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  // Paso 2
  const [groups, setGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  // Shared
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Paso 1 → carga grupos y avanza al paso 2
  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoadingGroups(true)

    try {
      const res = await fetch(`/api/groups?slug=${encodeURIComponent(slug)}`)

      let data: { groups?: Group[]; error?: string } = {}
      try {
        data = (await res.json()) as { groups?: Group[]; error?: string }
      } catch {
        throw new Error('Respuesta inesperada del servidor. Intenta de nuevo.')
      }

      if (!res.ok) throw new Error(data.error ?? 'Error al cargar horarios')

      const available = data.groups ?? []
      setGroups(available)

      // Si no hay grupos configurados, ir directo al pago sin paso 2
      if (available.length === 0) {
        await submitCheckout(null)
        return
      }

      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar horarios')
    } finally {
      setLoadingGroups(false)
    }
  }

  // Paso 2 → lanza el checkout con el grupo seleccionado
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    if (selectedGroupId === null) {
      setError('Selecciona un horario para continuar')
      return
    }
    await submitCheckout(selectedGroupId)
  }

  async function submitCheckout(groupId: number | null) {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug,
          plan,
          email: email.trim(),
          name: name.trim() || undefined,
          source,
          ...(groupId !== null ? { groupId } : {}),
        }),
      })

      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'No pudimos iniciar el pago. Intenta de nuevo.')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  const planLabel = plan === 'monthly' ? 'Suscripción mensual' : 'Acceso completo al curso'

  if (!mounted) return null

  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-dialog-title"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(null) }}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Volver"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <div>
                <h3
                  id="checkout-dialog-title"
                  className="text-lg font-bold text-white"
                >
                  {step === 1 ? 'Tus datos' : 'Elige tu horario'}
                </h3>
                <p className="text-sm text-white/80">{planLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="mt-4 flex gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-white" />
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step === 2 ? 'bg-white' : 'bg-white/30'
              }`}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
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
                disabled={loadingGroups || !email}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingGroups ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando horarios…
                  </>
                ) : (
                  <>Ver horarios disponibles →</>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Pago seguro procesado por Stripe. No guardamos tu tarjeta.
              </p>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Selecciona el grupo que mejor se adapte a tu horario. Cada sesión dura 80 min.
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {groups.map((g) => {
                  const plazasLibres = g.plazasTotal - g.plazasOcupadas
                  const agotado = plazasLibres <= 0
                  const selected = selectedGroupId === g.id

                  return (
                    <label
                      key={g.id}
                      className={`
                        flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-all
                        ${agotado
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : selected
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="group"
                        value={g.id}
                        disabled={agotado}
                        checked={selected}
                        onChange={() => { setSelectedGroupId(g.id); setError(null) }}
                        className="mt-0.5 accent-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {g.nombre}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              agotado
                                ? 'bg-red-100 text-red-600'
                                : plazasLibres <= 3
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {agotado ? 'Completo' : `${plazasLibres} plazas`}
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                            {g.dia} · Franja {g.franja}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-cyan-500" />
                            {g.horaInicio} – {g.horaFin}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-cyan-500" />
                            {g.plazasOcupadas}/{g.plazasTotal}
                          </span>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || selectedGroupId === null}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirigiendo a Stripe…
                  </>
                ) : (
                  <>Reservar plaza y pagar →</>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Tu plaza quedará confirmada al completar el pago.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}
