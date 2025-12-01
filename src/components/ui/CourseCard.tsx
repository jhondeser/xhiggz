// src/components/ui/CourseCard.tsx
"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface CourseCardProps {
  title: string;
  description: string;
  model3D?: ReactNode;
  emoji?: string;
  categoria?: string;
  nivel?: string;
  duracion?: string;
  precio?: {
    mensual: number;
    completo: number;
    moneda: string;
  };
}

export default function CourseCard({
  title,
  description,
  model3D,
  emoji,
  categoria,
  nivel,
  duracion,
  precio,
}: CourseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{ perspective: "1000px" }}
    >
      {/* Card Container con efecto flip */}
      <motion.div
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* FRENTE de la card (visible por defecto) */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Header */}
          <div>
            {/* Emoji y Badge de categoría */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{emoji}</div>
              {categoria && (
                <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                  {categoria}
                </span>
              )}
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {title}
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-3">
            {/* Info básica */}
            <div className="flex justify-between text-sm text-gray-500">
              {nivel && (
                <span className="flex items-center gap-1">
                  🎯 {nivel}
                </span>
              )}
              {duracion && (
                <span className="flex items-center gap-1">
                  ⏱️ {duracion}
                </span>
              )}
            </div>

            {/* Precio si existe */}
            {precio && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Desde</div>
                <div className="text-lg font-bold text-cyan-600">
                  ${precio.mensual}/{precio.moneda}
                </div>
              </div>
            )}

            {/* Indicador hover */}
            <div className="text-xs text-gray-400 text-center mt-2">
              ← Pasa el mouse para ver más →
            </div>
          </div>
        </div>

        {/* REVERSO de la card (se muestra al hacer flip) */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 shadow-lg p-6 flex flex-col backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          {/* Modelo 3D */}
          <div className="w-full h-[180px] mb-4 flex justify-center items-center bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl overflow-hidden">
            {model3D ? (
              <div className="w-full h-full flex items-center justify-center">
                {model3D}
              </div>
            ) : (
              <div className="text-6xl">{emoji}</div>
            )}
          </div>

          {/* Información detallada */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-3 text-center">
              Detalles del Curso
            </h4>
            
            <div className="space-y-3">
              {categoria && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium text-gray-900">{categoria}</span>
                </div>
              )}
              
              {nivel && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nivel:</span>
                  <span className="font-medium text-gray-900">{nivel}</span>
                </div>
              )}
              
              {duracion && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium text-gray-900">{duracion}</span>
                </div>
              )}
              
              {precio && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pago mensual:</span>
                    <span className="font-bold text-cyan-600">
                      ${precio.mensual}/{precio.moneda}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pago completo:</span>
                    <span className="font-bold text-green-600">
                      ${precio.completo}/{precio.moneda}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* CTA rápido */}
            <button className="w-full mt-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300">
              Ver más información
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}