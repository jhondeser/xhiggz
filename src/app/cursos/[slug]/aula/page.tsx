// src/app/cursos/[slug]/aula/page.tsx
//
// Ruta gated: solo accesible para alumnos con Enrollment ACTIVO al curso.
// Flujo:
//   1. Sin sesión → redirect a /login?from=/cursos/<slug>/aula
//   2. Sesión válida pero sin Enrollment ACTIVO → redirect al landing del curso
//   3. Sesión válida y Enrollment ACTIVO → render del aula
//
// Vídeos: cada grupo avanza a su ritmo. Un módulo está desbloqueado para el
// alumno si existe GroupModuleRelease para el groupId de su Enrollment.
// Sin grupo asignado → todo bloqueado (con aviso).

import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toYoutubeEmbedUrl } from "@/lib/video";
import { getReleasedModuleIds } from "@/server/module-releases";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AulaPage({ params }: PageProps) {
  const { slug } = await params;

  // 1) Curso existe?
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      temario: { orderBy: { orden: "asc" } },
    },
  });
  if (!course) notFound();

  // 2) Sesión válida?
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/login?from=/cursos/${slug}/aula`);
  }

  // 3) Enrollment activo para ESTE curso?
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const now = new Date();
  const hasAccess =
    enrollment !== null &&
    enrollment.status === "ACTIVE" &&
    (enrollment.expiresAt === null || enrollment.expiresAt > now);

  if (!hasAccess || !enrollment) {
    redirect(`/cursos/${slug}?reason=no-access`);
  }

  // 4) Módulos liberados para el grupo del alumno
  const releasedIds = await getReleasedModuleIds(enrollment.groupId);

  // 5) Render
  return (
    <div className="min-h-screen text-white">
      <DashboardBackground />
      <DashboardNavbar email={enrollment.user.email} />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-10">
        <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {course.title}
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Bienvenido, {enrollment.user.name}. Acceso{" "}
              {enrollment.expiresAt
                ? `hasta el ${enrollment.expiresAt.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`
                : "vitalicio"}
              .
            </p>
          </div>
          <div className="text-right text-xs text-white/30">
            <div>
              {course.modulosCount ?? course.temario.length} módulos ·{" "}
              {course.horas ?? 0}h · {course.proyectosCount ?? 0} proyectos
            </div>
            <div className="mt-1">
              Modalidad:{" "}
              {enrollment.source === "ONE_TIME"
                ? "Completo"
                : enrollment.source === "SUBSCRIPTION"
                  ? "Mensual"
                  : "Manual"}
            </div>
          </div>
        </header>

        {enrollment.groupId === null && (
          <div className="mb-6 bg-amber-500/10 border border-amber-400/30 text-amber-100 text-sm rounded-2xl p-4">
            Todavía no tienes un grupo de clase asignado, por eso los vídeos
            aparecen bloqueados. Escríbenos y te lo asignamos.
          </div>
        )}

        <div className="space-y-4">
          {course.temario.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white/40">
              El temario de este curso aún no está cargado en la BD.
            </div>
          ) : (
            course.temario.map((modulo, idx) => {
              const unlocked = releasedIds.has(modulo.id);
              const embedUrl = unlocked && modulo.videoUrl
                ? toYoutubeEmbedUrl(modulo.videoUrl)
                : null;
              return (
                <details
                  key={modulo.id}
                  className="group bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden"
                  open={idx === 0}
                >
                  <summary className="cursor-pointer p-6 flex justify-between items-start hover:bg-white/5 list-none">
                    <div>
                      <div className="text-white/30 text-xs mb-1">
                        Módulo {idx + 1} · {modulo.semanas}
                      </div>
                      <div className="text-lg font-semibold flex items-center gap-2">
                        {modulo.modulo}
                        {!unlocked && (
                          <span className="text-white/30 text-xs font-normal border border-white/15 rounded-full px-2 py-0.5">
                            🔒 Bloqueado
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-white/40 text-2xl select-none group-open:rotate-45 transition-transform">
                      +
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-0 border-t border-white/10">
                    {!unlocked ? (
                      <div className="mt-4 text-sm text-white/40 bg-white/5 rounded-xl p-4">
                        Este módulo todavía no está disponible para ti. Se
                        desbloquea conforme avanza tu clase — te avisamos
                        cuando esté listo.
                      </div>
                    ) : embedUrl ? (
                      <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden bg-black">
                        <iframe
                          src={embedUrl}
                          title={`Vídeo — ${modulo.modulo}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="mt-4 text-sm text-white/40 bg-white/5 rounded-xl p-4">
                        El vídeo de este módulo se publicará muy pronto.
                      </div>
                    )}
                    <ul className="mt-4 space-y-3">
                      {modulo.temas.map((tema, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm border-l-2 border-white/10 pl-4 py-1 hover:border-cyan-500/50 transition-colors"
                        >
                          <span className="text-white/30 text-xs mt-1 w-6 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 text-white/70">{tema}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })
          )}
        </div>

        <div className="mt-12 text-center text-sm text-white/25 border-t border-white/10 pt-8">
          Los vídeos y guías de cada lección se publicarán progresivamente.
          Recibirás un email cuando haya contenido nuevo disponible.
        </div>
      </div>
    </div>
  );
}
