"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  className?: string;
}

// Variants para el fondo: se desliza a la derecha
const imageVariants = {
  hidden: { x: 0 },
  visible: { x: "100%", transition: { duration: 0.7 } },
};

// Variants para el overlay: aparece con opacidad
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.2, duration: 0.4 } },
};

export default function CourseCard({
  course,
  className = "",
}: CourseCardProps) {
  const isExternal = course.slug.startsWith("http");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil (<768px)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.a
      href={isExternal ? course.slug : `/cursos/${course.slug}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener" : undefined}
      className={`relative overflow-hidden rounded-xl shadow-lg  md:h-60 group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: "2rem", height: "15rem" }}
    >
      {/* Imagen de fondo */}
      <motion.div
        className="md:h-60 absolute inset-0 bg-cover bg-center rounded-xl transition-transform duration-700 group-hover:translate-x-full"
        style={{ backgroundImage: `url(${course.img})` }}
        {...(isMobile && {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.3 },
          variants: imageVariants,
        })}
      />

      {/* Overlay de contenido */}
      <motion.div
        className={`
          md:h-60 relative z-10 flex flex-col h-full justify-center mb-4 md:mb-8
          opacity-0 group-hover:opacity-100 text-gray-500 group-hover:text-black
          transition-opacity transition-colors duration-400 ease-in-out delay-200
          bg-white/90 rounded-xl
        `}
        {...(isMobile && {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.3 },
          variants: overlayVariants,
        })}
      >
        <div className="md:h-60 flex flex-col lg:flex-row w-full h-full overflow-hidden rounded-xl">
          {/* 3D o emoji */}
          <div className="w-full lg:w-1/3 bg-gray-100 flex items-center justify-center p-4">
            {course.model3D ? (
              <div className="w-full h-full flex items-center justify-center">
                {course.model3D}
              </div>
            ) : (
              <div className="text-6xl">{course.emoji}</div>
            )}
          </div>

          {/* Texto descriptivo */}
          <div className="md:h-60 w-full lg:w-2/3 p-6 flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              {course.title}
            </h3>
            <p className="text-gray-600 flex-grow">{course.description}</p>
            <span className="mt-4 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {course.categoria}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
}
