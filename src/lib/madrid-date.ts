// src/lib/madrid-date.ts
//
// Fechas de clase en hora de Madrid. Las sesiones (GroupSession.fecha) son
// columnas DATE sin hora: se guardan como medianoche UTC del día de Madrid
// para que Prisma no las desplace de día.

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

/** "YYYY-MM-DD" de hoy en Europe/Madrid. */
export function todayMadridYmd(now: Date = new Date()): string {
  // en-CA formatea como YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isYmd(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

/** "YYYY-MM-DD" → Date para una columna @db.Date. */
export function ymdToDbDate(ymd: string): Date {
  if (!isYmd(ymd)) throw new Error(`Fecha inválida: ${ymd}`);
  return new Date(`${ymd}T00:00:00Z`);
}

/** Date de una columna @db.Date → "YYYY-MM-DD". */
export function dbDateToYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Suma días a un "YYYY-MM-DD". */
export function addDaysYmd(ymd: string, days: number): string {
  const d = ymdToDbDate(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return dbDateToYmd(d);
}

/** Día de la semana en español ("Lunes"…"Domingo") de un "YYYY-MM-DD". */
export function weekdayEs(ymd: string): string {
  return DIAS_SEMANA[ymdToDbDate(ymd).getUTCDay()];
}

/** Compara nombres de día ignorando mayúsculas y tildes ("Miercoles" = "Miércoles"). */
export function sameDia(a: string, b: string): boolean {
  const norm = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
  return norm(a) === norm(b);
}

/** "2026-09-23" → "mié, 23 sept 2026" */
export function formatYmdEs(ymd: string): string {
  return ymdToDbDate(ymd).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Fechas (YYYY-MM-DD) de los últimos `days` días, hoy incluido, que caen en
 * el día de la semana `dia`. Más reciente primero.
 */
export function recentClassDates(dia: string, days: number, today = todayMadridYmd()): string[] {
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    const ymd = addDaysYmd(today, -i);
    if (sameDia(weekdayEs(ymd), dia)) out.push(ymd);
  }
  return out;
}
