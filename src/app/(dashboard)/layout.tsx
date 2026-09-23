import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Los profesores no tienen área de alumno: van a su panel.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role === "TEACHER") redirect("/profesor");

  return (
    <div className="min-h-screen text-white">
      <DashboardBackground />
      <DashboardNavbar email={session.user.email} />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">{children}</main>
    </div>
  );
}
