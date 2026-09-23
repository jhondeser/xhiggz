// src/app/profesor/layout.tsx
//
// Área de profesores. Solo User con role = TEACHER. El middleware solo exige
// sesión; el rol se comprueba aquí y otra vez en cada página y server action.

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentTeacher } from "@/server/teachers";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

export const dynamic = "force-dynamic";

const TEACHER_LINKS = [{ href: "/profesor", label: "Mis grupos" }];

export default async function ProfesorLayout({ children }: { children: React.ReactNode }) {
  const teacher = await getCurrentTeacher();
  if (!teacher) {
    const session = await getServerSession(authOptions);
    // Sin sesión → login. Con sesión pero sin rol TEACHER → su área de alumno.
    redirect(session?.user ? "/mis-cursos" : "/login?from=/profesor");
  }

  return (
    <div className="min-h-screen text-white">
      <DashboardBackground />
      <DashboardNavbar email={teacher.email} links={TEACHER_LINKS} />
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-10">{children}</main>
    </div>
  );
}
