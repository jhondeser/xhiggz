// src/app/admin/(panel)/contenido/page.tsx
//
// Admin: asignar el vídeo de YouTube (no listado) de cada módulo de un curso.
// El vídeo en sí se sube a YouTube fuera de aquí — esto solo guarda el link.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/video";
import { setModuleVideo, togglePublicado } from "./actions";

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
        include: { temario: { orderBy: { orden: "asc" } } },
      })
    : null;

  return (
    <div className="max-w-5xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Contenido</h1>
        <p className="text-slate-400 text-sm mt-1">
          Vídeos por módulo (alojados como no listados en YouTube). Sube el
          vídeo a YouTube primero, luego pega aquí el link.
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
        <div className="space-y-3">
          {selected.temario.map((modulo, idx) => {
            const currentId = modulo.videoUrl
              ? extractYoutubeId(modulo.videoUrl)
              : null;
            return (
              <div
                key={modulo.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">
                      Módulo {idx + 1} · {modulo.semanas}
                    </div>
                    <div className="text-base font-semibold text-slate-100">
                      {modulo.modulo}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-md border ${
                        modulo.videoUrl
                          ? "bg-emerald-900/40 text-emerald-300 border-emerald-800"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {modulo.videoUrl ? "Con vídeo" : "Sin vídeo"}
                    </span>
                    <form action={togglePublicado}>
                      <input type="hidden" name="moduleId" value={modulo.id} />
                      <input
                        type="hidden"
                        name="courseSlug"
                        value={selected.slug}
                      />
                      <input
                        type="hidden"
                        name="nextValue"
                        value={String(!modulo.publicado)}
                      />
                      <button
                        type="submit"
                        disabled={!modulo.videoUrl}
                        title={
                          !modulo.videoUrl
                            ? "Primero pega el link del vídeo"
                            : modulo.publicado
                              ? "Publicado — clic para ocultar"
                              : "Oculto — clic para publicar"
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                          modulo.publicado ? "bg-emerald-600" : "bg-slate-700"
                        } ${!modulo.videoUrl ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            modulo.publicado ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </form>
                  </div>
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
                    placeholder="https://www.youtube.com/watch?v=... (vacío = quitar vídeo)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-4 py-2 shrink-0"
                  >
                    Guardar
                  </button>
                </form>

                {currentId && (
                  <div className="mt-2 text-xs text-slate-500">
                    ID detectado: <span className="text-slate-300">{currentId}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
