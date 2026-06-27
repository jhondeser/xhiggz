// src/app/(dashboard)/mis-cursos/page.tsx

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EnrolledCourseCard from "@/components/dashboard/EnrolledCourseCard";

export const dynamic = "force-dynamic";

export default async function MisCursosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const now = new Date();
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    include: {
      course: {
        select: {
          slug: true,
          title: true,
          description: true,
          emoji: true,
          categoria: true,
          img: true,
          nivel: true,
          duracion: true,
          modelKey: true,
          modulosCount: true,
          horas: true,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Mis cursos</h1>
      <p className="text-white/50 text-sm mb-8">
        {enrollments.length === 0
          ? "Aún no tienes cursos activos."
          : `${enrollments.length} curso${enrollments.length !== 1 ? "s" : ""} activo${enrollments.length !== 1 ? "s" : ""}`}
      </p>

      {enrollments.length === 0 ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
          <p className="text-white/50 mb-5 text-sm">
            Cuando compres un curso aparecerá aquí.
          </p>
          <Link
            href="/cursos"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-5 py-2.5 transition"
          >
            Explorar cursos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {enrollments.map(({ course, expiresAt, source }) => (
            <EnrolledCourseCard
              key={course.slug}
              slug={course.slug}
              title={course.title}
              description={course.description}
              emoji={course.emoji}
              categoria={course.categoria}
              img={course.img}
              nivel={course.nivel}
              duracion={course.duracion}
              modelKey={course.modelKey}
              modulosCount={course.modulosCount}
              horas={course.horas}
              source={source}
              expiresAt={expiresAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
