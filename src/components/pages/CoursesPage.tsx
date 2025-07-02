// src/components/pages/CoursesPage.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";
import CoursesHeader from "./CoursesHeader";
import ContactForm from "@/components/sections/ContactForm";
import { courses } from "@/data/cursos";
import CourseCard from "@/components/common/CourseCards";


export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(courses.map((c) => c.categoria)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "Todas" || c.categoria === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <>
      <CoursesHeader />
      <section className="py-16 bg-white text-gray-800">
        {/* Contenedor sin max-width para que ocupe todo el ancho */}
        <div className="w-full px-4 sm:px-6">
          {/* Buscador */}
          <div className="flex justify-center mb-6">
            <input
              type="search"
              placeholder="Busca un curso..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-md p-3 rounded-l-xl border border-r-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setQuery("")}
              className="bg-white border border-l-0 border-blue-500 text-blue-500 px-4 rounded-r-xl hover:bg-blue-50 transition"
            >
              ✕
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full transition ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lista vertical de cards full-width */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron cursos para “<strong>{query}</strong>” en la
              categoría “<strong>{activeCategory}</strong>”.
            </p>
          ) : (
            <div className="w-[70%] mx-auto space-y-8 marginBottom: '2rem' overflow-hidden rounded-xl">
              {filtered.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>


      <ContactForm />
    </>
  );
}
