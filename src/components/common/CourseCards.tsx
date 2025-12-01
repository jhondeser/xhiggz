"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Course } from "@/types";
import { 
  ClockIcon, 
  AcademicCapIcon, 
  ChevronRightIcon,
  SparklesIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export default function CourseCard({
  course,
  className = "",
}: CourseCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsFlipped(false);
    }
  };

  const handleCardClick = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  const courseUrl = `/cursos/${course.slug}`;

  const handleViewCourse = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(courseUrl);
  };

  return (
    <div
      className={`relative w-full h-[550px] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Card Container */}
      <div 
        className="relative w-full h-[500px] transition-transform duration-300 ease-out"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
      >
        {/* FRENTE de la card - Deshabilitado cuando está girado */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900/95 to-gray-900/95 rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden cursor-pointer ${
            isFlipped ? "pointer-events-none" : ""
          }`}
          style={{ 
            backfaceVisibility: "hidden",
            // Ocultar visualmente cuando no está activa
            opacity: isFlipped ? 0 : 1,
            transition: "opacity 0.1s ease"
          }}
          onClick={(e) => {
            // Solo permitir click en mobile para flip
            if (!isMobile) e.stopPropagation();
          }}
        >
          {/* Imagen de fondo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
            style={{ backgroundImage: `url(${course.img})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>

          {/* Contenido principal */}
          <div className="relative z-10 h-full flex flex-col justify-between p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="text-4xl drop-shadow-lg">{course.emoji}</div>
              
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                  {course.categoria}
                </span>
                
                {course.destacado && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    <SparklesIcon className="w-3 h-3" />
                    Destacado
                  </span>
                )}
              </div>
            </div>

            {/* Título y descripción */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                {course.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">
                {course.description}
              </p>
            </div>

            {/* Info rápida */}
            <div className="flex items-center gap-3 mb-4">
              {course.nivel && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <AcademicCapIcon className="w-4 h-4 text-cyan-300" />
                  <span className="text-white text-xs font-medium">{course.nivel}</span>
                </div>
              )}
              
              {course.duracion && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <ClockIcon className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-xs font-medium">{course.duracion}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  {course.precio ? (
                    <div className="text-white">
                      <div className="text-xs text-gray-300 mb-1">Desde</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                        ${course.precio.mensual}/{course.precio.moneda}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-300">Consultar precio</div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-xs hidden sm:inline">{isMobile ? "Tocar" : "Ver más"}</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVERSO de la card - Solo interactivo cuando está visible */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl border-2 border-cyan-500/30 shadow-2xl p-5 flex flex-col overflow-hidden ${
            !isFlipped ? "pointer-events-none" : ""
          }`}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            // Ocultar visualmente cuando no está activa
            opacity: !isFlipped ? 0 : 1,
            transition: "opacity 0.1s ease"
          }}
          onClick={(e) => {
            // Evitar que el click en el reverso active el flip
            e.stopPropagation();
          }}
        >
          {/* Fondo decorativo */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>

          {/* Modelo 3D */}
          <div className="relative z-10 w-full h-48 mb-4 flex justify-center items-center bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl border border-cyan-500/20 overflow-hidden">
            {course.model3D ? (
              <div className="w-full h-full flex items-center justify-center">
                {course.model3D}
              </div>
            ) : (
              <div className="text-6xl">{course.emoji}</div>
            )}
          </div>

          {/* Información detallada */}
          <div className="relative z-10 flex-1">
            <div className="mb-3">
              <h4 className="font-bold text-white mb-1 text-lg">
                {course.title}
              </h4>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                {course.description}
              </p>
            </div>

            {/* Detalles */}
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">Nivel</div>
                  <div className="text-white text-sm font-medium">{course.nivel || "Principiante"}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">Duración</div>
                  <div className="text-white text-sm font-medium">{course.duracion || "8 semanas"}</div>
                </div>
              </div>

              {course.precio && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-300">Mensual</div>
                      <div className="text-lg font-bold text-white">
                        ${course.precio.mensual}/{course.precio.moneda}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">Completo</div>
                      <div className="text-lg font-bold text-green-300">
                        ${course.precio.completo}/{course.precio.moneda}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de acción */}
            <div className="mt-auto">
              <button
                onClick={handleViewCourse}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Ver Curso Completo
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de flip */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        <div className={`w-1.5 h-1.5 rounded-full transition-all ${!isFlipped ? "bg-cyan-400" : "bg-gray-600"}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-all ${isFlipped ? "bg-cyan-400" : "bg-gray-600"}`} />
      </div>
    </div>
  );
}