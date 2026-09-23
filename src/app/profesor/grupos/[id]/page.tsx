// src/app/profesor/grupos/[id]/page.tsx
//
// Un grupo del profesor: registrar la clase, sus alumnos y el contenido del
// curso. El profesor ve TODOS los vídeos (para preparar la clase) y decide
// cuáles libera a su grupo.

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentTeacher } from "@/server/teachers";
import { VENTANA_DIAS } from "@/server/group-sessions";
import { toYoutubeEmbedUrl } from "@/lib/video";
import { dbDateToYmd, formatYmdEs, recentClassDates } from "@/lib/madrid-date";
import {
  teacherRegisterSession,
  teacherToggleRelease,
  teacherUpdateObservaciones,
} from "./actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}

export default async function ProfesorGrupoPage({ params, searchParams }: PageProps) {
  const teacher = await getCurrentTeacher();
  if (!teacher) redirect("/login?from=/profesor");

  const { id } = await params;
  const sp = await searchParams;
  const groupId = Number(id);
  if (!Number.isInteger(groupId) || groupId <= 0) notFound();

  const now = new Date();
  const group = await prisma.courseGroup.findUnique({
    where: { id: groupId },
    include: {
      course: {
        select: {
          title: true,
          emoji: true,
          temario: {
            orderBy: { orden: "asc" },
            select: { id: true, modulo: true, semanas: true, temas: true, videoUrl: true },
          },
        },
      },
      moduleReleases: { select: { moduleId: true, publishedAt: true } },
      enrollments: {
        where: {
          status: "ACTIVE",
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        // Solo lo necesario para dar clase: nada de emails, padres ni pagos.
        select: { id: true, user: { select: { name: true } } },
        orderBy: { user: { name: "asc" } },
      },
      // Todas las del grupo (también de un profesor anterior) para saber qué
      // días ya están registrados; al profesor solo se le muestran las suyas.
      sessions: {
        orderBy: { fecha: "desc" },
        select: { id: true, fecha: true, estado: true, observaciones: true, teacherId: true },
      },
    },
  });

  // Un grupo que no es suyo se trata como inexistente (no revelamos que existe).
  if (!group || group.teacherId !== teacher.id) notFound();

  const released = new Map(group.moduleReleases.map((r) => [r.moduleId, r.publishedAt]));
  const misSesiones = group.sessions.filter((s) => s.teacherId === teacher.id);
  const registradas = new Set(group.sessions.map((s) => dbDateToYmd(s.fecha)));
  const fechasPendientes = recentClassDates(group.dia, VENTANA_DIAS + 1).filter(
    (d) => !registradas.has(d),
  );

  return (
    <div className="space-y-10">
      <header>
        <Link href="/profesor" className="text-white/40 hover:text-white/70 text-sm">
          ← Mis grupos
        </Link>
        <div className="text-white/40 text-sm mt-4">
          {group.course.emoji} {group.course.title}
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {group.nombre}
        </h1>
        <p className="text-white/60 text-sm mt-1">
          {group.dia} · {group.horaInicio}–{group.horaFin} · Franja {group.franja}
        </p>
      </header>

      {sp.error && (
        <div className="bg-red-500/10 border border-red-400/30 text-red-100 text-sm rounded-xl p-4">
          {sp.error}
        </div>
      )}
      {sp.ok && !sp.error && (
        <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-100 text-sm rounded-xl p-4">
          {sp.ok}
        </div>
      )}

      {/* ── Clases ─────────────────────────────────────────────────────── */}
      <section id="clases" className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-1">Clases</h2>
        <p className="text-white/50 text-sm mb-5">
          Registra cada clase al terminarla. Una por día de clase; puedes
          registrar las de los últimos {VENTANA_DIAS} días si se te olvidó.
        </p>

        {fechasPendientes.length === 0 ? (
          <div className="text-sm text-white/50 bg-white/5 rounded-xl p-4 mb-6">
            No tienes clases pendientes de registrar.
          </div>
        ) : (
          <form action={teacherRegisterSession} className="space-y-3 mb-8">
            <input type="hidden" name="groupId" value={group.id} />
            <label className="block text-sm">
              <span className="text-white/60">Fecha de la clase</span>
              <select
                name="fecha"
                defaultValue={fechasPendientes[0]}
                className="mt-1 block w-full sm:w-72 bg-black/40 border border-white/15 rounded-lg px-3 py-2"
              >
                {fechasPendientes.map((d) => (
                  <option key={d} value={d}>
                    {formatYmdEs(d)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-white/60">Observaciones (opcional)</span>
              <textarea
                name="observaciones"
                rows={3}
                maxLength={2000}
                placeholder="Qué se hizo, quién faltó, algo a tener en cuenta…"
                className="mt-1 block w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-5 py-2.5"
            >
              Registrar clase
            </button>
          </form>
        )}

        {misSesiones.length > 0 && (
          <ul className="divide-y divide-white/10">
            {misSesiones.map((s) => {
              const ymd = dbDateToYmd(s.fecha);
              const anulada = s.estado === "ANULADA";
              return (
                <li key={s.id} className="py-3">
                  <details>
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                      <span className={anulada ? "line-through text-white/40" : ""}>
                        {formatYmdEs(ymd)}
                      </span>
                      <span className="flex items-center gap-2 text-xs">
                        {anulada && (
                          <span className="border border-red-400/40 text-red-200 rounded-full px-2 py-0.5">
                            Anulada
                          </span>
                        )}
                        <span className="text-white/40 truncate max-w-[16rem]">
                          {s.observaciones ?? "Sin observaciones"}
                        </span>
                      </span>
                    </summary>
                    {!anulada && (
                      <form action={teacherUpdateObservaciones} className="mt-3 space-y-2">
                        <input type="hidden" name="groupId" value={group.id} />
                        <input type="hidden" name="sessionId" value={s.id} />
                        <textarea
                          name="observaciones"
                          rows={3}
                          maxLength={2000}
                          defaultValue={s.observaciones ?? ""}
                          className="block w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-white/10 hover:bg-white/20 text-sm rounded-lg px-4 py-1.5"
                        >
                          Guardar observaciones
                        </button>
                      </form>
                    )}
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Alumnos ────────────────────────────────────────────────────── */}
      <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Alumnos <span className="text-white/40 font-normal">({group.enrollments.length})</span>
        </h2>
        {group.enrollments.length === 0 ? (
          <p className="text-white/50 text-sm">Este grupo todavía no tiene alumnos.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {group.enrollments.map((e) => (
              <li key={e.id} className="bg-white/5 rounded-lg px-3 py-2">
                {e.user.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Contenido ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold mb-1">Contenido del curso</h2>
        <p className="text-white/50 text-sm mb-5">
          Tú ves todos los vídeos. Tus alumnos solo ven los que liberes para
          este grupo.
        </p>

        {group.course.temario.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/40">
            El temario de este curso aún no está cargado.
          </div>
        ) : (
          <div className="space-y-4">
            {group.course.temario.map((m, idx) => {
              const on = released.has(m.id);
              const embedUrl = m.videoUrl ? toYoutubeEmbedUrl(m.videoUrl) : null;
              const disabled = !m.videoUrl && !on;
              return (
                <details
                  key={m.id}
                  id={`modulo-${m.id}`}
                  className="group bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden"
                >
                  <summary className="cursor-pointer p-5 flex justify-between items-center gap-4 hover:bg-white/5 list-none">
                    <div>
                      <div className="text-white/30 text-xs mb-1">
                        Módulo {idx + 1} · {m.semanas}
                      </div>
                      <div className="font-semibold">{m.modulo}</div>
                    </div>
                    <span
                      className={`text-xs rounded-full px-2.5 py-1 border shrink-0 ${
                        on
                          ? "border-emerald-400/40 text-emerald-200"
                          : m.videoUrl
                            ? "border-white/15 text-white/50"
                            : "border-white/10 text-white/30"
                      }`}
                    >
                      {on ? "Liberado" : m.videoUrl ? "Oculto a tus alumnos" : "Sin vídeo"}
                    </span>
                  </summary>

                  <div className="px-5 pb-5 border-t border-white/10">
                    <form action={teacherToggleRelease} className="mt-4">
                      <input type="hidden" name="groupId" value={group.id} />
                      <input type="hidden" name="moduleId" value={m.id} />
                      <input type="hidden" name="nextValue" value={String(!on)} />
                      <button
                        type="submit"
                        disabled={disabled}
                        title={disabled ? "Este módulo aún no tiene vídeo" : undefined}
                        className={`text-sm font-medium rounded-lg px-4 py-2 ${
                          on
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {on ? "Ocultar a mis alumnos" : "Liberar a mis alumnos"}
                      </button>
                    </form>

                    {embedUrl ? (
                      <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden bg-black">
                        <iframe
                          src={embedUrl}
                          title={`Vídeo — ${m.modulo}`}
                          className="w-full h-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="mt-4 text-sm text-white/40 bg-white/5 rounded-xl p-4">
                        Este módulo todavía no tiene vídeo.
                      </div>
                    )}

                    {m.temas.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {m.temas.map((tema, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm border-l-2 border-white/10 pl-4 py-1"
                          >
                            <span className="text-white/30 text-xs mt-0.5 w-6 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 text-white/70">{tema}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
