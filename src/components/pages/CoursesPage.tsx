"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoursesHeader from "./CoursesHeader";
import ContactForm from "@/components/sections/ContactForm";
import type { Course } from "@/types";
import CourseCard from "@/components/common/CourseCards";
import {
  Search,
  X,
  Filter,
} from "lucide-react";

interface CoursesPageProps {
  courses: Course[];
}

export default function CoursesPage({ courses }: CoursesPageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileCard, setActiveMobileCard] = useState<string | null>(null);
  const [activeDesktopCard, setActiveDesktopCard] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(courses.map((c) => c.categoria)))],
    [courses]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categoria.toLowerCase().includes(q);

      const matchesCategory =
        activeCategory === "Todas" || c.categoria === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [query, activeCategory, courses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <CoursesHeader />

      <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-200 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-200 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Filter className="w-4 h-4" />
              Explora Nuestros Cursos
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold mb-6"
            >
              Encuentra Tu{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Camino
              </span>{" "}
              Tecnológico
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Filtra por categoría o busca el curso perfecto para tus objetivos
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="search"
                placeholder="Buscar cursos por nombre, descripción o categoría..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-4"
            >
              <span className="flex items-center gap-2 text-gray-700">
                <Filter className="w-4 h-4" />
                Filtros: {activeCategory}
              </span>
              <span className="text-cyan-600 font-semibold">
                {showMobileFilters ? "Ocultar" : "Mostrar"}
              </span>
            </button>

            <div className={`${showMobileFilters ? "block" : "hidden"} md:block`}>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowMobileFilters(false);
                      setActiveMobileCard(null);
                      setActiveDesktopCard(null);
                    }}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 border-2 ${
                      activeCategory === cat
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-cyan-300 hover:shadow-md"
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-8">
            <p className="text-gray-600">
              Mostrando{" "}
              <span className="font-semibold text-cyan-600">{filtered.length}</span> de{" "}
              <span className="font-semibold text-gray-900">{courses.length}</span> cursos
              {query && (
                <>
                  {" "}para "<span className="font-semibold text-gray-900">{query}</span>"
                </>
              )}
              {activeCategory !== "Todas" && (
                <>
                  {" "}en <span className="font-semibold text-gray-900">{activeCategory}</span>
                </>
              )}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            layout
            className="max-w-7xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No se encontraron cursos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No hay resultados para "<strong>{query}</strong>"
                    {activeCategory !== "Todas" && (
                      <>
                        {" "}en <strong>{activeCategory}</strong>
                      </>
                    )}
                    .
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("Todas");
                      setActiveMobileCard(null);
                      setActiveDesktopCard(null);
                    }}
                    className="bg-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-cyan-700 transition-colors"
                  >
                    Mostrar todos los cursos
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filtered.map((course, index) => {
                    const isFlipped = isMobile
                      ? activeMobileCard === course.id
                      : activeDesktopCard === course.id;

                    return (
                      <motion.div
                        key={course.slug}
                        variants={itemVariants}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={
                          !isMobile
                            ? {
                                y: -4,
                                transition: { duration: 0.2 },
                              }
                            : undefined
                        }
                        className="h-full"
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
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <ContactForm />
    </>
  );
}