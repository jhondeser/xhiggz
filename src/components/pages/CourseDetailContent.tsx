// src/components/pages/CourseDetailContent.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Course } from "@/types";
import InstructorsSection from "./InstructorsSection";
import { 
  ArrowLeftIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

interface Props {
  course: Course;
}

export default function CourseDetailContent({ course }: Props) {
  const features = [
    { icon: <AcademicCapIcon className="w-5 h-5" />, text: "Acceso de por vida" },
    { icon: <CheckCircleIcon className="w-5 h-5" />, text: "Certificado incluido" },
    { icon: <UsersIcon className="w-5 h-5" />, text: "Comunidad exclusiva" },
    { icon: <RocketLaunchIcon className="w-5 h-5" />, text: "Proyectos reales" },
  ];

  const learningPoints = [
    "Fundamentos sólidos de la tecnología",
    "Desarrollo de proyectos prácticos desde cero",
    "Metodologías ágiles y buenas prácticas",
    "Integración con herramientas modernas",
    "Optimización y escalabilidad",
    "Preparación para el mercado laboral"
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24"> {/* Padding superior para header */}
      {/* Hero Section Mejorada */}
      <section className="relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Mejorado */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link 
              href="/cursos" 
              className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium group transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver a todos los cursos
            </Link>
          </motion.div>

          {/* Contenido Principal */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Información del Curso */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Badge de Categoría */}
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium">
                {course.emoji || "🎯"} {course.categoria}
              </div>

              {/* Título */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>

              {/* Descripción */}
              <p className="text-xl text-gray-600 leading-relaxed">
                {course.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-700 font-semibold">4.9/5</span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">150+ estudiantes</span>
                </div>
              </div>

              {/* Duración y Nivel */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{course.duracion}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
                  <AcademicCapIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{course.nivel || "Todos los niveles"}</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="text-cyan-500">
                      {feature.icon}
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/inscripcion"
                  className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-3"
                >
                  <span>🚀 Inscribirme Ahora</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/contacto"
                  className="border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-2xl hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 inline-flex items-center justify-center"
                >
                  💬 Tener una consulta
                </Link>
              </div>
            </motion.div>

            {/* Modelo 3D / Imagen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl p-8 border border-gray-200/50 backdrop-blur-sm">
                {course.model3D || (
                  <div className="w-full h-[400px] bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🎓</div>
                      <h3 className="text-2xl font-bold mb-2">Visualización del Curso</h3>
                      <p className="text-cyan-100">Contenido interactivo disponible</p>
                    </div>
                  </div>
                )}
                
                {/* Elemento decorativo flotante */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg border">
                  <div className="text-2xl">🔥</div>
                  <p className="text-xs font-semibold text-gray-800 mt-1">Oferta Especial</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección de Detalles en Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lo que Aprenderás */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircleIcon className="w-4 h-4" />
              Lo que Aprenderás
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Habilidades que Desarrollarás
            </h2>
            
            <ul className="space-y-4">
              {learningPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Detalles del Programa */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AcademicCapIcon className="w-4 h-4" />
              Detalles del Programa
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Estructura del Curso
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Duración</span>
                </div>
                <span className="font-bold text-gray-900">{course.duracion}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Modalidad</span>
                </div>
                <span className="font-bold text-gray-900">100% Online</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <RocketLaunchIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Proyectos</span>
                </div>
                <span className="font-bold text-gray-900">5+ prácticos</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                href="/contacto"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                📋 Solicitar Temario Completo
              </Link>
            </div>
          </motion.div>

          {/* Inversión */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
          >
            {/* Elemento decorativo */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CurrencyDollarIcon className="w-4 h-4" />
                Inversión
              </div>
              
              <h2 className="text-2xl font-bold mb-6">
                Tu Futuro Comienza Aquí
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-4xl font-bold mb-2">$299</div>
                  <div className="text-cyan-100">Pago Único</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      Ahorro del 20%
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      Acceso vitalicio
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-4xl font-bold mb-2">$35/mes</div>
                  <div className="text-cyan-100">Plan Mensual</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      Sin compromiso
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      Cancelación fácil
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/inscripcion"
                  className="w-full bg-white text-cyan-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  💳 Comenzar Ahora
                </Link>
                <p className="text-center text-cyan-200 text-sm">
                  ✅ Garantía de 30 días • ✅ Financiamiento disponible
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección de Instructores */}
      <InstructorsSection />
    </main>
  );
}