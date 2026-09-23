// src/app/admin/(panel)/sesiones/page.tsx
//
// Admin: clases registradas por mes. Resumen por profesor (base del pago:
// cuenta solo IMPARTIDA) y detalle con anular/restaurar.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dbDateToYmd, formatYmdEs, todayMadridYmd, ymdToDbDate } from "@/lib/madrid-date";
import { adminRegisterSession, adminSetSessionEstado } from "./actions";

export const dynamic = "force-dynamic";

interface SP {
  mes?: string;
  ok?: string;
  error?: string;
}

function shiftMonth(mes: string, delta: number): string {
  const [y, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export default async function SesionesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const today = todayMadridYmd();
  const mes = sp.mes && /^\d{4}-\d{2}$/.test(sp.mes) ? sp.mes : today.slice(0, 7);
  const from = ymdToDbDate(`${mes}-01`);
  const to = ymdToDbDate(`${shiftMonth(mes, 1)}-01`);

  const [sessions, groupsWithTeacher] = await Promise.all([
    prisma.groupSession.findMany({
      where: { fecha: { gte: from, lt: to } },
      orderBy: [{ fecha: "desc" }, { id: "desc" }],
      include: {
        teacher: { select: { id: true, name: true } },
        group: { select: { nombre: true, course: { select: { title: true, emoji: true } } } },
      },
    }),
    prisma.courseGroup.findMany({
      where: { teacherId: { not: null } },
      select: {
        id: true,
        nombre: true,
        dia: true,
        course: { select: { title: true } },
        teacher: { select: { name: true } },
      },
      orderBy: [{ courseId: "asc" }, { id: "asc" }],
    }),
  ]);

  // Resumen por profesor (el teacherId guardado en cada sesión).
  const resumen = new Map<number, { name: string; impartidas: number; anuladas: number }>();
  for (const s of sessions) {
    const r = resumen.get(s.teacher.id) ?? { name: s.teacher.name, impartidas: 0, anuladas: 0 };
    if (s.estado === "IMPARTIDA") r.impartidas++;
    else r.anuladas++;
    resumen.set(s.teacher.id, r);
  }
  const resumenRows = [...resumen.values()].sort((a, b) => a.name.localeCompare(b.name));

  const mesLabel = ymdToDbDate(`${mes}-01`).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Clases registradas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Una por grupo y día. Para el pago cuentan solo las impartidas.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/admin/sesiones?mes=${shiftMonth(mes, -1)}`} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">
            ←
          </Link>
          <span className="w-40 text-center capitalize">{mesLabel}</span>
          <Link href={`/admin/sesiones?mes=${shiftMonth(mes, 1)}`} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">
            →
          </Link>
        </div>
      </header>

      {sp.error && (
        <div className="bg-red-950/40 border border-red-800 text-red-200 text-sm rounded-xl p-4">{sp.error}</div>
      )}
      {sp.ok && !sp.error && (
        <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-sm rounded-xl p-4">
          {sp.ok}
        </div>
      )}

      {/* ── Resumen ────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Resumen del mes</h2>
        {resumenRows.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay clases registradas este mes.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-800">
                <th className="py-2 font-medium">Profesor</th>
                <th className="py-2 font-medium text-right">Impartidas</th>
                <th className="py-2 font-medium text-right">Anuladas</th>
              </tr>
            </thead>
            <tbody>
              {resumenRows.map((r) => (
                <tr key={r.name} className="border-b border-slate-800 last:border-0">
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-right font-semibold">{r.impartidas}</td>
                  <td className="py-2 text-right text-slate-500">{r.anuladas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ── Registrar desde admin ──────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h2 className="font-semibold mb-1">Registrar una clase</h2>
        <p className="text-slate-500 text-xs mb-3">
          Para recuperaciones o cambios de día. Se asigna al profesor actual del grupo.
        </p>
        {groupsWithTeacher.length === 0 ? (
          <p className="text-slate-500 text-sm">Ningún grupo tiene profesor asignado.</p>
        ) : (
          <form action={adminRegisterSession} className="flex flex-wrap gap-3 items-end text-sm">
            <input type="hidden" name="mes" value={mes} />
            <label>
              <span className="text-slate-400">Grupo</span>
              <select name="groupId" className="mt-1 block bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 w-80">
                {groupsWithTeacher.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.course.title} · {g.nombre} ({g.dia}) — {g.teacher?.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-slate-400">Fecha</span>
              <input
                type="date"
                name="fecha"
                max={today}
                defaultValue={today}
                required
                className="mt-1 block bg-slate-950 border border-slate-700 rounded-lg px-3 py-2"
              />
            </label>
            <label className="flex-1 min-w-[14rem]">
              <span className="text-slate-400">Observaciones</span>
              <input name="observaciones" className="mt-1 block w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2" />
            </label>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-4 py-2">
              Registrar
            </button>
          </form>
        )}
      </section>

      {/* ── Detalle ────────────────────────────────────────────────────── */}
      <section className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-400">
              <th className="p-3 font-medium">Fecha</th>
              <th className="p-3 font-medium">Grupo</th>
              <th className="p-3 font-medium">Profesor</th>
              <th className="p-3 font-medium">Observaciones</th>
              <th className="p-3 font-medium">Registrada por</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              const anulada = s.estado === "ANULADA";
              return (
                <tr key={s.id} className={`border-b border-slate-800 last:border-0 align-top ${anulada ? "opacity-50" : ""}`}>
                  <td className={`p-3 whitespace-nowrap ${anulada ? "line-through" : ""}`}>
                    {formatYmdEs(dbDateToYmd(s.fecha))}
                  </td>
                  <td className="p-3">
                    {s.group.course.emoji} {s.group.course.title} · {s.group.nombre}
                  </td>
                  <td className="p-3">{s.teacher.name}</td>
                  <td className="p-3 text-slate-400 max-w-xs">{s.observaciones ?? "—"}</td>
                  <td className="p-3 text-slate-500">{s.createdById ? "Profesor" : "Admin"}</td>
                  <td className="p-3 text-right">
                    <form action={adminSetSessionEstado}>
                      <input type="hidden" name="mes" value={mes} />
                      <input type="hidden" name="sessionId" value={s.id} />
                      <input type="hidden" name="estado" value={anulada ? "IMPARTIDA" : "ANULADA"} />
                      <button type="submit" className={`text-xs ${anulada ? "text-emerald-400" : "text-slate-400 hover:text-red-300"}`}>
                        {anulada ? "Restaurar" : "Anular"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
