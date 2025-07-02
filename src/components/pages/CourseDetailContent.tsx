// src/components/pages/CourseDetailContent.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Course } from "@/types";
import InstructorsSection from "./InstructorsSection";

interface Props {
  course: Course;
}

export default function CourseDetailContent({ course }: Props) {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Link href="/cursos" className="text-blue-600 hover:underline">
          ← Volver a todos los cursos
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          mx-4 md:mx-auto              /* 1rem margenes lados en móvil, auto en md+ */
          max-w-screen-sm md:max-w-7xl  /* ancho máximo 640px en móvil, 80rem en md+ */
          px-4 sm:px-6 lg:px-8          /* padding interior lateral */
          py-12                        /* padding vertical */
          bg-white shadow-lg rounded-xl
          grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
        {/* Texto */}
        <div className="space-y-6">
          <div className="flex items-center text-4xl">
            <h1 className="font-extrabold leading-snug">{course.title}</h1>
          </div>
          <p className="text-gray-700">{course.description}</p>
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
            {course.categoria}
          </span>
        </div>

        {/* Modelo 3D */}
        <div className="w-full h-80 flex justify-center items-center">
          {course.model3D}
        </div>
      </motion.section>

      {/* “Lo que aprenderás” + tarjetas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1) Lo que aprenderás */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Introducción a {course.title.toLowerCase()}</li>
            <li>Proyectos prácticos paso a paso</li>
            <li>Recursos y plantillas descargables</li>
            <li>Acceso a comunidad y soporte</li>
          </ul>
        </motion.div>

        {/* 2) Detalles adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow rounded-xl p-8 flex flex-col"
        >
          <h2 className="text-2xl font-bold mb-4">Detalles adicionales</h2>
          <p className="text-gray-700 mb-6">
            ¿Tienes dudas? Ponte en contacto con nosotros para más información.
          </p>

          <div className="flex-grow flex justify-center items-center mb-6">
            <img
              src="/images/conference.png"
              alt="Información adicional"
              className="w-32 h-32 object-contain"
            />
          </div>

          <Link
            href="/contacto"
            className="mt-auto inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Contactar
          </Link>
        </motion.div>

        {/* 3) Costos y Pago mensual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow rounded-xl p-8 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Costos del Curso</h2>
            <p className="text-gray-700 mb-6">
              Acceso completo al contenido y a la comunidad de Xhiggz.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                Pago único: <strong>$299</strong>
              </li>
              <li>
                O en mensualidades de <strong>$35/mes</strong>
              </li>
              <li>Incluye tutorías y recursos extra</li>
            </ul>
          </div>
          <Link
            href="/inscripcion"
            className="mt-6 self-start bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Inscribirme
          </Link>
        </motion.div>
      </section>

      {/* Sección de instructores */}
      <InstructorsSection />
    </main>
  );
}
