// src/components/dashboard/EnrolledCourseCard.tsx
//
// Card flip para cursos del alumno — misma mecánica que CourseCards.tsx:
// - Frente: imagen de fondo + info del curso + tipo de acceso
// - Reverso: modelo 3D + botón "Ir al aula"
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { modelRegistry, preloadModel, type ModelKey } from "@/components/three/modelRegistry";
import { Clock, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

interface EnrolledCourseCardProps {
  slug: string;
  title: string;
  description: string;
  emoji?: string | null;
  categoria: string;
  img: string;
  nivel?: string | null;
  duracion?: string | null;
  modelKey?: string | null;
  modulosCount?: number | null;
  horas?: number | null;
  source: "ONE_TIME" | "SUBSCRIPTION" | "MANUAL";
  expiresAt?: Date | null;
}

const SOURCE_LABEL: Record<string, string> = {
  ONE_TIME: "Acceso anual",
  SUBSCRIPTION: "Suscripción mensual",
  MANUAL: "Acceso manual",
};

export default function EnrolledCourseCard({
  slug,
  title,
  description,
  emoji,
  categoria,
  img,
  nivel,
  duracion,
  modelKey,
  modulosCount,
  horas,
  source,
  expiresAt,
}: EnrolledCourseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadModel, setShouldLoadModel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const triggerPreload = useCallback(() => {
    if (modelKey) preloadModel(modelKey as ModelKey);
  }, [modelKey]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Precarga al entrar en viewport
  useEffect(() => {
    if (!modelKey) return;
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerPreload();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [modelKey, triggerPreload]);

  // Controla cuándo renderizar el modelo
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (isFlipped) {
      setModelReady(false);
      timeout = setTimeout(() => setShouldLoadModel(true), 300);
    } else {
      timeout = setTimeout(() => {
        setShouldLoadModel(false);
        setModelReady(false);
      }, 200);
    }
    return () => { if (timeout) clearTimeout(timeout); };
  }, [isFlipped]);

  const renderModel = () => {
    const ModelComponent = modelKey
      ? modelRegistry[modelKey as keyof typeof modelRegistry]
      : null;
    if (!shouldLoadModel || !ModelComponent) return null;
    return <ModelComponent onReady={() => setModelReady(true)} />;
  };

  const accessLabel = expiresAt
    ? `hasta ${expiresAt.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}`
    : "acceso vitalicio";

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[650px]"
      onMouseEnter={() => { if (!isMobile) { setIsFlipped(true); triggerPreload(); } }}
      onMouseLeave={() => { if (!isMobile) setIsFlipped(false); }}
      onClick={() => { if (isMobile) setIsFlipped((f) => !f); }}
    >
      {/* Contenedor flip */}
      <div
        className="relative w-full h-[600px]"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
          willChange: "transform",
        }}
      >
        {/* ── FRENTE ─────────────────────────────────────────────────────── */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900/95 to-gray-900/95 rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden cursor-pointer ${isFlipped ? "pointer-events-none" : ""}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(0deg) translateZ(0)" }}
        >
          {/* Imagen de fondo */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ${!isMobile ? "hover:scale-110" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="text-4xl drop-shadow-lg">{emoji}</div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                  {categoria}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
                  ✓ Inscrito
                </span>
              </div>
            </div>

            {/* Título */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                {title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
            </div>

            {/* Nivel + duración */}
            <div className="flex items-center gap-3 mb-4">
              {nivel && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <GraduationCap className="w-4 h-4 text-cyan-300" />
                  <span className="text-white text-xs font-medium">{nivel}</span>
                </div>
              )}
              {duracion && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span className="text-white text-xs font-medium">{duracion}</span>
                </div>
              )}
            </div>

            {/* Acceso */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-300 mb-1">{SOURCE_LABEL[source]}</div>
                  <div className="text-sm font-semibold text-emerald-300">{accessLabel}</div>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-xs hidden sm:inline">
                    {isMobile ? "Tocar" : "Ver modelo"}
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── REVERSO ────────────────────────────────────────────────────── */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl border-2 border-cyan-500/30 shadow-2xl p-5 flex flex-col overflow-hidden ${!isFlipped ? "pointer-events-none" : ""}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl" />

          {/* Modelo 3D */}
          <div className="relative z-10 w-full h-[280px] mb-4 flex justify-center items-center bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl border border-cyan-500/20 overflow-hidden">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${modelReady ? "opacity-0" : "opacity-100"}`}
              style={{ backgroundImage: `url(${img})` }}
              aria-hidden="true"
            />
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${modelReady ? "opacity-0" : "opacity-100"}`}
              style={{ background: "radial-gradient(circle at center, rgba(2,6,23,0.25), rgba(2,6,23,0.55) 70%, rgba(2,6,23,0.75) 100%)" }}
              aria-hidden="true"
            />
            {shouldLoadModel && !modelReady && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 z-20">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs font-medium">Cargando modelo…</span>
              </div>
            )}
            <div
              className={`w-full h-full flex items-center justify-center transition-all duration-500 ${modelReady ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-[2px]"}`}
              style={{ transform: "translateZ(1px)" }}
            >
              {renderModel()}
            </div>
          </div>

          {/* Info del reverso */}
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="mb-3">
              <h4 className="font-bold text-white mb-1 text-lg">{title}</h4>
              <p className="text-gray-300 text-sm line-clamp-2 mb-3">{description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {modulosCount != null && (
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">Módulos</div>
                  <div className="text-white text-sm font-medium">{modulosCount}</div>
                </div>
              )}
              {horas != null && (
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="text-xs text-gray-400">Horas</div>
                  <div className="text-white text-sm font-medium">{horas}h</div>
                </div>
              )}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-300">{SOURCE_LABEL[source]}</div>
              <div className="text-sm font-semibold text-emerald-300">{accessLabel}</div>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => router.push(`/cursos/${slug}/aula`)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Ir al aula
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de cara */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        <div className={`w-1.5 h-1.5 rounded-full transition-all ${!isFlipped ? "bg-cyan-400" : "bg-gray-600"}`} />
        <div className={`w-1.5 h-1.5 rounded-full transition-all ${isFlipped ? "bg-emerald-400" : "bg-gray-600"}`} />
      </div>
    </div>
  );
}
