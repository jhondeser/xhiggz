"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LogoAnimated from "@/components/common/LogoAnimated";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-[#0b0e1b] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <LogoAnimated />
        </Link>

        {/* Botón hamburguesa (móvil) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-white/10 transition"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navegación + botones (escritorio) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link href="/cursos" className="hover:text-cyan-400 transition">
            Cursos
          </Link>
          <Link href="/nosotros" className="hover:text-cyan-400 transition">
            Nosotros
          </Link>
          <Link href="/comunidad" className="hover:text-cyan-400 transition">
            Comunidad
          </Link>
          <Link href="/contacto" className="hover:text-cyan-400 transition">
            Contacto
          </Link>
        </nav>
        <div className="hidden md:flex gap-4 items-center">
          <Link
            href="/login"
            className="px-4 py-2 text-sm border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <nav
        className={`
          md:hidden
          bg-[#0b0e1b] text-white
          overflow-hidden
          transition-[max-height] duration-300
          ${isOpen ? "max-h-screen" : "max-h-0"}
        `}
      >
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/cursos"
            className="block text-base font-medium hover:text-cyan-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Cursos
          </Link>
          <Link
            href="/nosotros"
            className="block text-base font-medium hover:text-cyan-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Nosotros
          </Link>
          <Link
            href="/comunidad"
            className="block text-base font-medium hover:text-cyan-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Comunidad
          </Link>
          <Link
            href="/contacto"
            className="block text-base font-medium hover:text-cyan-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>

          <div className="pt-2 border-t border-white/20 flex flex-col gap-3">
            <Link
              href="/login"
              className="block px-4 py-2 text-center text-sm border border-white rounded-full hover:bg-white hover:text-black transition"
              onClick={() => setIsOpen(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="block px-4 py-2 text-center text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
              onClick={() => setIsOpen(false)}
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
