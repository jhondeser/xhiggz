// src/app/(dashboard)/mi-cuenta/page.tsx
//
// Perfil del alumno: datos básicos, suscripciones activas y logout.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";

export default async function MiCuentaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) return null;

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: user.id,
      status: { in: ["ACTIVE", "TRIALING"] },
    },
    include: {
      course: { select: { title: true, emoji: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl xl:max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Mi cuenta</h1>

      {/* Perfil */}
      <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 mb-5">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
          Perfil
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-white/50">Nombre</dt>
            <dd className="text-white">{user.name}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-white/50">Email</dt>
            <dd className="text-white">{user.email}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-white/50">Tipo de cuenta</dt>
            <dd className="text-xs bg-blue-500/20 border border-blue-500/30 rounded-full px-2.5 py-0.5 text-cyan-300 uppercase tracking-wide">
              {user.role === "STUDENT"
                ? "Alumno"
                : user.role === "TEACHER"
                  ? "Instructor"
                  : "Admin"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Suscripciones activas */}
      {subscriptions.length > 0 && (
        <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 mb-5">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            Suscripciones activas
          </h2>
          <ul className="space-y-3">
            {subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-white/80">
                  {sub.course.emoji ?? "🎓"} {sub.course.title}
                </span>
                <span className="text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
                  {sub.status === "TRIALING" ? "En prueba" : "Activa"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/30 mt-4 border-t border-white/10 pt-4">
            Para cancelar una suscripción escríbenos a{" "}
            <a
              href="mailto:soporte@xhiggz.com"
              className="text-white/50 hover:text-cyan-400 underline transition-colors"
            >
              soporte@xhiggz.com
            </a>
          </p>
        </section>
      )}

    </div>
  );
}
