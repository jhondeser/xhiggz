"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LogoAnimated from "@/components/common/LogoAnimated";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar hidratación hasta que el componente esté montado en el cliente
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Durante la hidratación, usar clases base sin condiciones
  if (!isMounted) {
    return (
      <header className="w-full bg-[#0b0e1b] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <LogoAnimated />
          </Link>

          <button className="md:hidden p-2 rounded-md hover:bg-white/10 transition">
            <Menu size={24} />
          </button>

          <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
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
      </header>
    );
  }

  // Renderizado normal después de la montura
  return (
    <header 
      className={`
        w-full text-white fixed top-0 z-50
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? "bg-[#0b0e1b] shadow-lg backdrop-blur-md bg-opacity-95" 
          : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-transform hover:scale-105 duration-200"
        >
          <LogoAnimated />
        </Link>

        {/* Botón hamburguesa (móvil) */}
        <button
          className={`
            md:hidden p-2 rounded-md transition-all duration-200
            ${isScrolled 
              ? "hover:bg-white/10" 
              : "hover:bg-black/20"
            }
          `}
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navegación + botones (escritorio) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
          <Link 
            href="/cursos" 
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Cursos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/nosotros" 
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Nosotros
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/comunidad" 
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Comunidad
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/contacto" 
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Contacto
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>
        
        <div className="hidden md:flex gap-4 items-center">
          <Link
            href="/login"
            className={`
              px-4 py-2 text-sm rounded-full transition-all duration-200 font-medium
              ${isScrolled 
                ? "border border-white hover:bg-white hover:text-black" 
                : "border border-white/50 hover:bg-white hover:text-black"
              }
            `}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-cyan-500/25"
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <nav
        className={`
          md:hidden overflow-hidden transition-all duration-300
          ${isScrolled ? "bg-[#0b0e1b]" : "bg-black/95 backdrop-blur-md"}
          ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/cursos"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Cursos
          </Link>
          <Link
            href="/nosotros"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Nosotros
          </Link>
          <Link
            href="/comunidad"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Comunidad
          </Link>
          <Link
            href="/contacto"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>

          <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
            <Link
              href="/login"
              className={`
                block px-4 py-3 text-center text-sm rounded-full transition-all duration-200 font-medium
                ${isScrolled 
                  ? "border border-white hover:bg-white hover:text-black" 
                  : "border border-white hover:bg-white hover:text-black"
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="block px-4 py-3 text-center text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full transition-all duration-200 font-medium"
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