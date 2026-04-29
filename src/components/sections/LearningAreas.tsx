"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { Course } from "@/types";
import CourseCard from "@/components/common/CourseCards";
import { Sparkles, GraduationCap, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

interface LearningAreasProps {
  courses: Course[];
}

export default function LearningAreas({ courses }: LearningAreasProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileCard, setActiveMobileCard] = useState<string | null>(null);
  const [activeDesktopCard, setActiveDesktopCard] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="relative py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden "
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Mejorado */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={headerVariants}
            className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Rutas de Aprendizaje
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Domina las{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Tecnologías
            </span>{" "}
            del Futuro
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explora nuestros programas diseñados para transformarte de principiante a experto. 
            <strong className="text-cyan-600"> Aprende creando proyectos reales</strong> con las herramientas más demandadas.
          </p>

          {/* Stats rápidos */}
          <motion.div
            variants={headerVariants}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-600">Cursos Especializados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Estudiantes Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Tasa de Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600">Acceso Permanente</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Grid de Cursos Mejorado */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={container}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
        {courses
          .filter((course) => ["1", "3", "6"].includes(course.id))
          .map((course) => {
            const isFlipped = isMobile
              ? activeMobileCard === course.id
              : activeDesktopCard === course.id;

            return (
              <motion.div
                key={course.slug}
                variants={item}
                whileHover={
                  !isMobile ? { y: -8, transition: { duration: 0.3 } } : undefined
                }
                className="group"
              >
                <CourseCard
                  course={course}
                  isFlipped={isFlipped}
                  onFlip={() => {
                    if (isMobile) {
                      setActiveMobileCard((prev) =>
                        prev === course.id ? null : course.id
                      );
                    }
                  }}
                  onHoverStart={() => {
                    if (!isMobile) setActiveDesktopCard(course.id);
                  }}
                  onHoverEnd={() => {
                    if (!isMobile) {
                      setActiveDesktopCard((prev) =>
                        prev === course.id ? null : prev
                      );
                    }
                  }}
                />
              </motion.div>
            );
                })}
        </motion.div>

        <motion.div
          variants={{ 
            hidden: { opacity: 0, y: 20 }, 
            visible: { opacity: 1, y: 0 } 
          }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center mt-10"
        >
          <motion.a
            href="/cursos"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Explorar Cursos
          </motion.a>
        
        </motion.div>

        {/* Call to Action al final */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl max-w-2xl mx-auto">
            <Rocket className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
            <p className="text-cyan-100 mb-6">
              Tenemos programas personalizados y mentorías 1:1 para tus objetivos específicos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                👥 Hablar con un Mentor
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                📞 Solicitar Info Personalizada
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}