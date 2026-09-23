// src/app/admin/(panel)/contenido/page.tsx
//
// Admin: vídeos por módulo y su liberación POR GRUPO.
// - Cada módulo tiene un único vídeo (YouTube no listado) para todo el curso.
// - Cada grupo (CourseGroup) avanza a su ritmo: el vídeo se libera celda a
//   celda en la matriz módulos × grupos (GroupModuleRelease).

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/video";
import { setModuleVideo, toggleGroupRelease } from "./actions";

export const dynamic = "force-dynamic";

interface SP {
  course?: string;
}

export default async function ContenidoPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const courses = await prisma.course.findMany({
    select: { id: true, slug: true, title: true, emoji: true },
    orderBy: { title: "asc" },
  });

  const selectedSlug = sp.course || courses[0]?.slug;
  const selected = selectedSlug
    ? await prisma.course.findUnique({
        where: { slug: selectedSlug },
        include: {
          temario: {
            orderBy: { orden: "asc" },
            include: { releases: { select: { groupId: true } } },
          },
          groups: {
            orderBy: { id: "asc" },
            include: {
              _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
            },
          },
        },
      })
    : null;

  return (
    <div className="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Contenido</h1>
        <p className="text-slate-400 text-sm mt-1">
          Sube el vídeo a YouTube (no listado), pega el link en su módulo y
          libéralo solo para los grupos que ya dieron esa clase.
        </p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {courses.map((c) => (
          <Link
            key={c.slug}
            href={`/admin/contenido?course=${c.slug}`}
            className={`px-3 py-2 rounded-lg text-sm border ${
              c.slug === selectedSlug
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {c.emoji} {c.title}
          </Link>
        ))}
      </div>

      {!selected ? (
        <div className="text-slate-500">No hay cursos.</div>
      ) : selected.temario.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
          Este curso todavía no tiene temario cargado en la BD.
        </div>
      ) : (
        <>
          {selected.groups.length === 0 && (
            <div className="mb-4 bg-amber-950/40 border border-amber-800 text-amber-200 text-sm rounded-xl p-4">
              Este curso no tiene grupos: puedes guardar vídeos, pero no hay a
              quién liberarlos.
            </div>
          )}

          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="p-4 font-medium text-slate-400 min-w-[22rem]">
                    Módulo y vídeo
                  </th>
                  {selected.groups.map((g) => {
                    const liberados = selected.temario.filter((m) =>
                      m.releases.some((r) => r.groupId === g.id),
                    ).length;
                    return (
                      <th
                        key={g.id}
                        className="p-4 font-medium text-center align-bottom min-w-[8rem]"
                      >
                        <div className="text-slate-100">
                          {g.nombre}
                          {!g.activo && (
                            <span className="ml-1 text-[10px] uppercase text-slate-500">
                              (cerrado)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-normal">
                          {g.dia} · Franja {g.franja} · {g.horaInicio}
                        </div>
                        <div className="text-xs text-slate-500 font-normal">
                          {g._count.enrollments} alumno
                          {g._count.enrollments === 1 ? "" : "s"} · {liberados}/
                          {selected.temario.length} liberados
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {selected.temario.map((modulo, idx) => {
                  const currentId = modulo.videoUrl
                    ? extractYoutubeId(modulo.videoUrl)
                    : null;
                  const releasedFor = new Set(
                    modulo.releases.map((r) => r.groupId),
                  );
                  return (
                    <tr
                      key={modulo.id}
                      className="border-b border-slate-800 last:border-0 align-top"
                    >
                      <td className="p-4">
                        <div className="text-xs text-slate-500 mb-0.5">
                          Módulo {idx + 1} · {modulo.semanas}
                        </div>
                        <div className="font-semibold text-slate-100 mb-2">
                          {modulo.modulo}
                        </div>
                        <form action={setModuleVideo} className="flex gap-2">
                          <input type="hidden" name="moduleId" value={modulo.id} />
                          <input
                            type="hidden"
                            name="courseSlug"
                            value={selected.slug}
                          />
                          <input
                            name="videoUrl"
                            defaultValue={modulo.videoUrl ?? ""}
                            placeholder="https://www.youtube.com/watch?v=... (vacío = quitar)"
                            className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                          />
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-3 py-1.5 shrink-0"
                          >
                            Guardar
                          </button>
                        </form>
                        <div className="mt-1 text-xs text-slate-500">
                          {currentId ? (
                            <>
                              ID detectado:{" "}
                              <span className="text-slate-300">{currentId}</span>
                            </>
                          ) : (
                            "Sin vídeo — no se puede liberar"
                          )}
                        </div>
                      </td>

                      {selected.groups.map((g) => {
                        const on = releasedFor.has(g.id);
                        const disabled = !modulo.videoUrl && !on;
                        return (
                          <td key={g.id} className="p-4 text-center align-middle">
                            <form action={toggleGroupRelease}>
                              <input type="hidden" name="moduleId" value={modulo.id} />
                              <input type="hidden" name="groupId" value={g.id} />
                              <input
                                type="hidden"
                                name="courseSlug"
                                value={selected.slug}
                              />
                              <input
                                type="hidden"
                                name="nextValue"
                                value={String(!on)}
                              />
                              <button
                                type="submit"
                                disabled={disabled}
                                aria-label={`${on ? "Ocultar" : "Liberar"} ${modulo.modulo} para ${g.nombre}`}
                                title={
                                  disabled
                                    ? "Primero pega el link del vídeo"
                                    : on
                                      ? `Liberado para ${g.nombre} — clic para ocultar`
                                      : `Oculto para ${g.nombre} — clic para liberar`
                                }
                                className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                                  on ? "bg-emerald-600" : "bg-slate-700"
                                } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                <span
                                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    on ? "translate-x-6" : ""
                                  }`}
                                />
                              </button>
                            </form>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
