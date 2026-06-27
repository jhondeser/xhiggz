"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LogoAnimated from "@/components/common/LogoAnimated";
import LogoutButton from "@/components/auth/LogoutButton";

interface DashboardNavbarProps {
  email?: string | null;
}

export default function DashboardNavbar({ email }: DashboardNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SSR skeleton — mismo que Navbar público
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
          <nav className="hidden md:flex gap-8 text-sm font-medium items-center" />
          <div className="hidden md:flex gap-4 items-center" />
        </div>
      </header>
    );
  }

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

        {/* Hamburguesa móvil */}
        <button
          className={`
            md:hidden p-2 rounded-md transition-all duration-200
            ${isScrolled ? "hover:bg-white/10" : "hover:bg-black/20"}
          `}
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
          <Link
            href="/mis-cursos"
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Mis cursos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="/mi-cuenta"
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Mi cuenta
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="/cursos"
            className="hover:text-cyan-400 transition-all duration-200 font-semibold relative group"
          >
            Explorar cursos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
          </Link>
        </nav>

        {/* Derecha — email + logout */}
        <div className="hidden md:flex gap-4 items-center">
          {email && (
            <span className="text-white/40 text-xs truncate max-w-[180px]">
              {email}
            </span>
          )}
          <LogoutButton />
        </div>
      </div>

      {/* Menú móvil */}
      <nav
        className={`
          md:hidden overflow-hidden transition-all duration-300
          ${isScrolled ? "bg-[#0b0e1b]" : "bg-black/95 backdrop-blur-md"}
          ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/mis-cursos"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Mis cursos
          </Link>
          <Link
            href="/mi-cuenta"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Mi cuenta
          </Link>
          <Link
            href="/cursos"
            className="block text-base font-medium hover:text-cyan-400 transition-all duration-200 py-2 border-b border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Explorar cursos
          </Link>
          <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
            {email && (
              <span className="text-white/40 text-xs text-center truncate">{email}</span>
            )}
            <LogoutButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
