// src/components/pages/CourseDetailContent.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Course } from "@/types";
import InstructorsSection from "./InstructorsSection";
import { modelRegistry } from "@/components/three/modelRegistry";
import BuyButton from "@/components/checkout/BuyButton";
import {
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  DollarSign,
  Clock,
  Users,
  Rocket,
  BookOpen,
  Wrench,
  Star,
} from "lucide-react";

interface Props {
  course: Course;
}

export default function CourseDetailContent({ course }: Props) {
  const features = [
    course.accesoVitalicio && {
      icon: <GraduationCap className="w-5 h-5" />,
      text: "Acceso de por vida",
    },
    course.certificado && {
      icon: <CheckCircle2 className="w-5 h-5" />,
      text: "Certificado incluido",
    },
    course.comunidad && {
      icon: <Users className="w-5 h-5" />,
      text: "Comunidad",
    },
    course.soporte && {
      icon: <Rocket className="w-5 h-5" />,
      text: "Soporte",
    },
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

  const moneda = course.precio?.moneda || "€";

  const ModelComponent = course.modelKey
  ? modelRegistry[course.modelKey as keyof typeof modelRegistry]
  : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
      {/* HERO */}
      <section className="relative overflow-hidden pt-6 sm:pt-8 lg:pt-10 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 sm:-top-40 sm:-right-40 w-56 h-56 sm:w-80 sm:h-80 bg-cyan-200 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -left-24 sm:-bottom-40 sm:-left-40 w-56 h-56 sm:w-80 sm:h-80 bg-blue-200 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-cyan-600 hover:text-cyan-700 font-medium group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver a todos los cursos
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* INFO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-5 sm:space-y-6 order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium max-w-full">
                <span className="shrink-0">{course.emoji || "🎯"}</span>
                <span className="truncate">{course.categoria}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight break-words">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base">
                {course.rating && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-2 text-gray-700 font-semibold">
                      {course.rating}/5
                    </span>
                  </div>
                )}

                {typeof course.estudiantes === "number" && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <span>
                      {course.estudiantes > 0
                        ? `${course.estudiantes}+ estudiantes`
                        : "Nuevo curso"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {course.duracion && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 sm:px-4 rounded-xl border border-gray-200 text-sm sm:text-base">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
                    <span className="text-gray-700">{course.duracion}</span>
                  </div>
                )}

                {course.nivel && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 sm:px-4 rounded-xl border border-gray-200 text-sm sm:text-base">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
                    <span className="text-gray-700">{course.nivel}</span>
                  </div>
                )}

                {course.contenido?.modulos && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 sm:px-4 rounded-xl border border-gray-200 text-sm sm:text-base">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
                    <span className="text-gray-700">
                      {course.contenido.modulos} módulos
                    </span>
                  </div>
                )}
              </div>

              {features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700 bg-white/70 rounded-xl px-3 py-2 border border-gray-100"
                    >
                      <div className="text-cyan-500 shrink-0">{feature.icon}</div>
                      <span className="text-sm sm:text-base">{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <BuyButton
                  slug={course.slug}
                  plan="yearly"
                  source={`hero:${course.slug}`}
                  variant="primary"
                  label="🚀 Inscribirme Ahora"
                />

                <Link
                  href="/contacto"
                  className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 font-semibold py-3.5 sm:py-4 px-5 sm:px-8 rounded-2xl hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base"
                >
                  💬 Tener una consulta
                </Link>
              </div>
            </motion.div>

            {/* VISUAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative h-[300px] sm:h-[380px] md:h-[460px] lg:h-[600px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 backdrop-blur-sm overflow-hidden">
                {ModelComponent ? <ModelComponent /> : null}

                {course.destacado && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:p-4 shadow-lg border max-w-[120px] sm:max-w-none">
                    <div className="text-lg sm:text-2xl">🔥</div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-800 mt-1 leading-tight">
                      Curso destacado
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOQUES REALES */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Objetivos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Lo que aprenderás
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Objetivos del curso
            </h2>

            <ul className="space-y-4">
              {course.objetivos?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Requisitos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              Requisitos
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Qué necesitas para empezar
            </h2>

            <ul className="space-y-4">
              {course.requisitos?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Precio real */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <DollarSign className="w-4 h-4" />
                Inversión
              </div>

              <h2 className="text-2xl font-bold mb-6">Elige cómo empezar</h2>

              <div className="space-y-4">
                {course.precio?.completo && (
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl space-y-4">
                    <div>
                      <div className="text-4xl font-bold mb-1">
                        {moneda}
                        {course.precio.completo}
                      </div>
                      <div className="text-cyan-100 text-sm">
                        Pago único · Acceso 1 año
                      </div>
                    </div>

                    <BuyButton
                      slug={course.slug}
                      plan="yearly"
                      source={`pricing-yearly:${course.slug}`}
                      variant="white"
                      label="🎓 Acceso 1 año"
                    />
                  </div>
                )}

                {course.precio?.mensual && (
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl space-y-4">
                    <div>
                      <div className="text-4xl font-bold mb-1">
                        {moneda}
                        {course.precio.mensual}
                        <span className="text-xl font-medium">/mes</span>
                      </div>
                      <div className="text-cyan-100 text-sm">
                        Suscripción · Cancela cuando quieras
                      </div>
                    </div>

                    <BuyButton
                      slug={course.slug}
                      plan="monthly"
                      source={`pricing-monthly:${course.slug}`}
                      variant="ghost"
                      label="📅 Suscríbete mensual"
                    />
                  </div>
                )}
              </div>

              <p className="mt-6 text-center text-cyan-200 text-sm">
                {course.certificado ? "✅ Certificado" : ""}{" "}
                {course.accesoVitalicio ? "• ✅ Acceso vitalicio" : ""}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TEMARIO REAL */}
      {course.temario && course.temario.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Temario del curso
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Módulos y contenido
            </h2>
            <p className="text-gray-600 mb-8">
              Este es el recorrido real del curso, organizado por módulos y semanas.
            </p>

            <div className="space-y-6">
              {course.temario.map((modulo, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {index + 1}. {modulo.modulo}
                      </h3>
                      <p className="text-sm text-cyan-700 font-medium mt-1">
                        {modulo.semanas}
                      </p>
                    </div>
                  </div>

                  <ul className="grid md:grid-cols-2 gap-3">
                    {modulo.temas.map((tema, temaIndex) => (
                      <li
                        key={temaIndex}
                        className="flex items-start gap-3 text-gray-700 bg-slate-50 rounded-xl px-4 py-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{tema}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* BENEFICIOS + STATS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {course.beneficios && course.beneficios.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Beneficios del curso
              </h2>

              <ul className="space-y-4">
                {course.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.estadisticas && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Estadísticas del curso
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-3xl font-bold text-cyan-600">
                    {course.estadisticas.satisfaccion}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Satisfacción</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-3xl font-bold text-cyan-600">
                    {course.estadisticas.completacion}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Completación</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-3xl font-bold text-cyan-600">
                    {course.contenido?.proyectos ?? 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Proyectos</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <InstructorsSection />
    </main>
  );
}