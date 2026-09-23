// src/app/profesor/page.tsx
//
// Inicio del profesor: sus grupos (CourseGroup.teacherId = él), con alumnos,
// avance de vídeos liberados y clases registradas este mes.

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentTeacher } from "@/server/teachers";
import {
  dbDateToYmd,
  formatYmdEs,
  sameDia,
  todayMadridYmd,
  weekdayEs,
  ymdToDbDate,
} from "@/lib/madrid-date";
import { diaIndex } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export default async function ProfesorHomePage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) redirect("/login?from=/profesor");

  const now = new Date();
  const today = todayMadridYmd(now);
  const monthStart = ymdToDbDate(`${today.slice(0, 7)}-01`);

  const groups = await prisma.courseGroup.findMany({
    where: { teacherId: teacher.id },
    include: {
      course: {
        select: { title: true, emoji: true, _count: { select: { temario: true } } },
      },
      _count: {
        select: {
          enrollments: {
            where: {
              status: "ACTIVE",
              OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            },
          },
          moduleReleases: true,
        },
      },
      sessions: {
        where: { teacherId: teacher.id, estado: "IMPARTIDA" },
        orderBy: { fecha: "desc" },
        select: { fecha: true },
      },
    },
  });

  groups.sort(
    (a, b) =>
      diaIndex(a.dia) - diaIndex(b.dia) || a.horaInicio.localeCompare(b.horaInicio),
  );

  const hoyEs = weekdayEs(today);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Hola, {teacher.name.split(" ")[0]}
      </h1>
      <p className="text-white/50 text-sm mb-8">
        {groups.length === 0
          ? "Todavía no tienes grupos asignados. Cuando el admin te asigne uno, aparecerá aquí."
          : `Tienes ${groups.length} grupo${groups.length === 1 ? "" : "s"}.`}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => {
          const ultima = g.sessions[0] ? dbDateToYmd(g.sessions[0].fecha) : null;
          const esteMes = g.sessions.filter((s) => s.fecha >= monthStart).length;
          const claseHoy = sameDia(g.dia, hoyEs);
          const pendienteHoy = claseHoy && ultima !== today;
          return (
            <Link
              key={g.id}
              href={`/profesor/grupos/${g.id}`}
              className="block bg-white/5 border border-white/10 hover:border-cyan-400/50 backdrop-blur-sm rounded-2xl p-6 transition"
            >
              <div className="text-white/40 text-xs mb-1">
                {g.course.emoji} {g.course.title}
              </div>
              <div className="text-xl font-bold mb-1">{g.nombre}</div>
              <div className="text-white/60 text-sm mb-4">
                {g.dia} · {g.horaInicio}–{g.horaFin} · Franja {g.franja}
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-white/40 text-xs">Alumnos</dt>
                  <dd className="font-semibold">{g._count.enrollments}</dd>
                </div>
                <div>
                  <dt className="text-white/40 text-xs">Vídeos liberados</dt>
                  <dd className="font-semibold">
                    {g._count.moduleReleases}/{g.course._count.temario}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/40 text-xs">Clases este mes</dt>
                  <dd className="font-semibold">{esteMes}</dd>
                </div>
                <div>
                  <dt className="text-white/40 text-xs">Última clase</dt>
                  <dd className="font-semibold">{ultima ? formatYmdEs(ultima) : "—"}</dd>
                </div>
              </dl>

              {pendienteHoy && (
                <div className="mt-4 text-xs bg-amber-500/10 border border-amber-400/30 text-amber-100 rounded-lg px-3 py-2">
                  Hoy tienes clase: regístrala al terminar.
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
