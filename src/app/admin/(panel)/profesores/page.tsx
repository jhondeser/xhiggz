// src/app/admin/(panel)/profesores/page.tsx
//
// Admin: alta de profesores y asignación de un profesor a cada grupo.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { diaIndex } from "@/lib/schedule";
import { todayMadridYmd, ymdToDbDate } from "@/lib/madrid-date";
import { createTeacher, removeTeacherRole, setGroupTeacher } from "./actions";

export const dynamic = "force-dynamic";

interface SP {
  ok?: string;
  error?: string;
}

export default async function ProfesoresPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const monthStart = ymdToDbDate(`${todayMadridYmd().slice(0, 7)}-01`);

  const [teachers, courses] = await Promise.all([
    prisma.user.findMany({
      where: { role: "TEACHER" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        groupsTaught: {
          select: { id: true, nombre: true, dia: true, course: { select: { title: true, emoji: true } } },
        },
        _count: {
          select: {
            sessionsTaught: { where: { estado: "IMPARTIDA", fecha: { gte: monthStart } } },
          },
        },
      },
    }),
    prisma.course.findMany({
      where: { groups: { some: {} } },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        emoji: true,
        groups: {
          select: {
            id: true,
            nombre: true,
            dia: true,
            franja: true,
            horaInicio: true,
            activo: true,
            teacherId: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-6xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold">Profesores</h1>
        <p className="text-slate-400 text-sm mt-1">
          Da de alta al profesor con el email con el que entrará con Google y
          asígnale sus grupos. Un grupo tiene un solo profesor.
        </p>
      </header>

      {sp.error && (
        <div className="bg-red-950/40 border border-red-800 text-red-200 text-sm rounded-xl p-4">{sp.error}</div>
      )}
      {sp.ok && !sp.error && (
        <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-sm rounded-xl p-4">
          {sp.ok}
        </div>
      )}

      {/* ── Alta ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Nuevo profesor</h2>
        <form action={createTeacher} className="flex flex-wrap gap-3 items-end">
          <label className="text-sm">
            <span className="text-slate-400">Nombre</span>
            <input
              name="name"
              className="mt-1 block w-60 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="text-slate-400">Email (cuenta de Google)</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-72 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            Dar de alta
          </button>
        </form>
      </section>

      {/* ── Lista de profesores ────────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-semibold">Equipo ({teachers.length})</h2>
          <Link href="/admin/sesiones" className="text-sm text-emerald-400 hover:underline">
            Ver clases registradas →
          </Link>
        </div>
        {teachers.length === 0 ? (
          <p className="text-slate-500 text-sm">Todavía no hay profesores.</p>
        ) : (
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="p-3 font-medium">Profesor</th>
                  <th className="p-3 font-medium">Grupos</th>
                  <th className="p-3 font-medium text-right">Clases este mes</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-b border-slate-800 last:border-0 align-top">
                    <td className="p-3">
                      <div className="font-medium text-slate-100">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.email}</div>
                    </td>
                    <td className="p-3 text-slate-300">
                      {t.groupsTaught.length === 0 ? (
                        <span className="text-slate-500">Sin grupos</span>
                      ) : (
                        t.groupsTaught
                          .slice()
                          .sort((a, b) => diaIndex(a.dia) - diaIndex(b.dia))
                          .map((g) => (
                            <div key={g.id}>
                              {g.course.emoji} {g.course.title} · {g.nombre} ({g.dia})
                            </div>
                          ))
                      )}
                    </td>
                    <td className="p-3 text-right font-semibold">{t._count.sessionsTaught}</td>
                    <td className="p-3 text-right">
                      {t.groupsTaught.length === 0 && (
                        <form action={removeTeacherRole}>
                          <input type="hidden" name="userId" value={t.id} />
                          <button type="submit" className="text-xs text-slate-400 hover:text-red-300">
                            Quitar rol de profesor
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Asignación por grupo ───────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Profesor de cada grupo</h2>
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="font-medium mb-3">
                {c.emoji} {c.title}
              </div>
              <div className="space-y-2">
                {c.groups
                  .slice()
                  .sort((a, b) => diaIndex(a.dia) - diaIndex(b.dia) || a.horaInicio.localeCompare(b.horaInicio))
                  .map((g) => (
                    <form
                      key={g.id}
                      action={setGroupTeacher}
                      className="flex flex-wrap items-center gap-3 text-sm"
                    >
                      <input type="hidden" name="groupId" value={g.id} />
                      <div className="w-64 text-slate-300">
                        {g.nombre} · {g.dia} · {g.horaInicio}
                        {!g.activo && <span className="ml-1 text-[10px] uppercase text-slate-500">(cerrado)</span>}
                      </div>
                      <select
                        name="teacherId"
                        defaultValue={g.teacherId ?? ""}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 w-60"
                      >
                        <option value="">— Sin profesor —</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5"
                      >
                        Guardar
                      </button>
                    </form>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
