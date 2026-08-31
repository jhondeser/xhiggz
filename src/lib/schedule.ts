// src/lib/schedule.ts
//
// Constantes del calendario de clases Xhiggz.
// Lun–Vie desde las 16:30 | Sábado desde las 10:00 | Domingo libre.
// Cada slot = 80 min de clase + 10 min de cierre.

export const FRANJAS = {
  A: { semana: { inicio: '16:30', fin: '18:00' }, sabado: { inicio: '10:00', fin: '11:30' } },
  B: { semana: { inicio: '18:00', fin: '19:30' }, sabado: { inicio: '11:30', fin: '13:00' } },
  C: { semana: { inicio: '19:30', fin: '21:00' }, sabado: { inicio: '13:00', fin: '14:30' } },
} as const

export type Franja = keyof typeof FRANJAS

export const DIAS_ORDEN = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const

export type Dia = (typeof DIAS_ORDEN)[number]

/** Devuelve la hora de inicio y fin de un slot dado su franja y día. */
export function getHorario(
  franja: Franja | string,
  dia: Dia | string,
): { inicio: string; fin: string } {
  const f = FRANJAS[franja as Franja]
  if (!f) return { inicio: '', fin: '' }
  return dia === 'Sábado' ? f.sabado : f.semana
}

/** Índice numérico de un día para ordenar (Lunes = 0, Sábado = 5). */
export function diaIndex(dia: string): number {
  return DIAS_ORDEN.indexOf(dia as Dia)
}

// =============================================================================
// Datos de seed: mapa (slug de curso, día, franja) → grupos iniciales
// =============================================================================

export interface GrupoSeedItem {
  cursoSlug: string
  nombre: string
  dia: Dia
  franja: Franja
  plazasTotal: number
}

export const GRUPOS_SEED: GrupoSeedItem[] = [
  // ── Franja A ─────────────────────────────────────────────────────────────
  // Minecraft Básico — Lun / Mié / Vie
  { cursoSlug: 'minecraft-education-basico', nombre: 'Grupo 1', dia: 'Lunes',     franja: 'A', plazasTotal: 10 },
  { cursoSlug: 'minecraft-education-basico', nombre: 'Grupo 2', dia: 'Miércoles', franja: 'A', plazasTotal: 10 },
  { cursoSlug: 'minecraft-education-basico', nombre: 'Grupo 3', dia: 'Viernes',   franja: 'A', plazasTotal: 10 },

  // Roblox Theme Park — Mar / Jue / Sáb
  { cursoSlug: 'roblox-studio-theme-park', nombre: 'Grupo 1', dia: 'Martes',  franja: 'A', plazasTotal: 10 },
  { cursoSlug: 'roblox-studio-theme-park', nombre: 'Grupo 2', dia: 'Jueves',  franja: 'A', plazasTotal: 10 },
  { cursoSlug: 'roblox-studio-theme-park', nombre: 'Grupo 3', dia: 'Sábado',  franja: 'A', plazasTotal: 10 },

  // ── Franja B ─────────────────────────────────────────────────────────────
  // Minecraft Java — Lun / Mié (2 grupos)
  { cursoSlug: 'minecraft-java-creator', nombre: 'Grupo 1', dia: 'Lunes',     franja: 'B', plazasTotal: 8 },
  { cursoSlug: 'minecraft-java-creator', nombre: 'Grupo 2', dia: 'Miércoles', franja: 'B', plazasTotal: 8 },

  // Roblox Archipelago — Mar / Jue (2 grupos)
  { cursoSlug: 'roblox-studio-xhiggs-archipelago', nombre: 'Grupo 1', dia: 'Martes', franja: 'B', plazasTotal: 8 },
  { cursoSlug: 'roblox-studio-xhiggs-archipelago', nombre: 'Grupo 2', dia: 'Jueves', franja: 'B', plazasTotal: 8 },

  // Godot 2D — Vie
  { cursoSlug: 'godot-2d-xhiggs-xelda',          nombre: 'Grupo 1', dia: 'Viernes', franja: 'B', plazasTotal: 8 },

  // Web Básico — Sáb
  { cursoSlug: 'programacion-web-basico-html-css-js', nombre: 'Grupo 1', dia: 'Sábado', franja: 'B', plazasTotal: 8 },

  // ── Franja C ─────────────────────────────────────────────────────────────
  { cursoSlug: 'roblox-studio-xhiggs-rpg',                        nombre: 'Grupo 1', dia: 'Lunes',     franja: 'C', plazasTotal: 8 },
  { cursoSlug: 'godot-3d-xelda-realms-of-xhiggs',                 nombre: 'Grupo 1', dia: 'Martes',    franja: 'C', plazasTotal: 8 },
  { cursoSlug: 'programacion-web-intermedio-dom-tailwind-apis',    nombre: 'Grupo 1', dia: 'Miércoles', franja: 'C', plazasTotal: 8 },
  { cursoSlug: 'programacion-web-avanzado-react-nextjs-fullstack', nombre: 'Grupo 1', dia: 'Jueves',    franja: 'C', plazasTotal: 8 },
]
