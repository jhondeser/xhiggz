"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * Wrapper cliente que decide si renderizar la chrome del sitio público
 * (Navbar + Footer + <main>) o pasar los children sin envoltorio.
 *
 * Las rutas /admin/* tienen su propio layout (en src/app/admin/(panel)/layout.tsx)
 * y NO deben heredar Navbar/Footer del root.
 */

export default function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isAuth = pathname === "/login" || pathname === "/registro";
  const isAula = pathname?.includes("/aula") ?? false;
  // El área del alumno (dashboard) tiene su propio layout con nav propio
  const isDashboard =
    pathname?.startsWith("/mis-cursos") ||
    pathname?.startsWith("/mi-cuenta") ||
    false;
  const skipChrome = isAdmin || isAuth || isAula || isDashboard;

  if (skipChrome) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main>{children}</main>
      {footer}
    </>
  );
}
