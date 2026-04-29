// src/server/courses.ts
//
// Queries de lectura para los cursos. Todas son funciones server-side
// (lo asegura el "import server-only" implícito al usar prisma).
//
// Devuelven el tipo Course que ya consumen los componentes de UI
// (forma anidada: precio.mensual, contenido.modulos, instructor.nombre…).
// Para no obligar a refactorizar la UI, mapeamos los campos planos de
// Prisma a la forma anidada en mapToCourse().

import { prisma } from "@/lib/prisma";
import type { Course as UICourse } from "@/types";
import type { Course as PrismaCourse, CourseModule, Nivel } from "@prisma/client";

type PrismaCourseWithModules = PrismaCourse & { temario: CourseModule[] };

// Convierte el enum de Prisma al string que usa la UI.
function nivelToString(n: Nivel | null): UICourse["nivel"] {
  if (!n) return undefined;
  switch (n) {
    case "Principiante":     return "Principiante";
    case "Intermedio":       return "Intermedio";
    case "Avanzado":         return "Avanzado";
    case "TodosLosNiveles":  return "Todos los niveles";
  }
}

function mapToCourse(c: PrismaCourseWithModules): UICourse {
  const tienePrecio   = c.precioMensual != null && c.precioCompleto != null;
  const tieneContenido = c.modulosCount != null && c.horas != null && c.proyectosCount != null;
  const tieneStats    = c.satisfaccion != null || c.empleabilidad != null || c.completacion != null;
  const tieneInstructor = !!c.instructorNombre;

  return {
    id:          String(c.id),
    slug:        c.slug,
    title:       c.title,
    description: c.description,
    emoji:       c.emoji ?? undefined,
    modelKey:    c.modelKey ?? undefined,
    categoria:   c.categoria,
    img:         c.img,

    nivel:       nivelToString(c.nivel),
    duracion:    c.duracion ?? undefined,
    rating:      c.rating ?? undefined,
    estudiantes: c.estudiantes,
    destacado:   c.destacado,
    tags:        c.tags,

    precio: tienePrecio ? {
      mensual:  c.precioMensual!,
      completo: c.precioCompleto!,
      moneda:   c.precioMoneda ?? "€",
    } : undefined,

    contenido: tieneContenido ? {
      modulos:   c.modulosCount!,
      horas:     c.horas!,
      proyectos: c.proyectosCount!,
    } : undefined,

    requisitos: c.requisitos,
    objetivos:  c.objetivos,
    beneficios: c.beneficios,

    certificado:     c.certificado,
    accesoVitalicio: c.accesoVitalicio,
    soporte:         c.soporte,
    comunidad:       c.comunidad,

    estadisticas: tieneStats ? {
      satisfaccion:  c.satisfaccion ?? 0,
      empleabilidad: c.empleabilidad ?? 0,
      completacion:  c.completacion ?? 0,
    } : undefined,

    fechaInicio: c.fechaInicio?.toISOString(),
    fechaFin:    c.fechaFin?.toISOString(),

    instructor: tieneInstructor ? {
      nombre:      c.instructorNombre!,
      avatar:      c.instructorAvatar ?? "",
      rol:         c.instructorRol ?? "",
      experiencia: c.instructorExperiencia ?? "",
    } : undefined,

    temario: c.temario
      .sort((a, b) => a.orden - b.orden)
      .map((m) => ({
        modulo:  m.modulo,
        semanas: m.semanas,
        temas:   m.temas,
      })),
  };
}

/** Devuelve todos los cursos, ordenados por destacados primero y luego por id. */
export async function getCourses(): Promise<UICourse[]> {
  const rows = await prisma.course.findMany({
    include: { temario: true },
    orderBy: [{ destacado: "desc" }, { id: "asc" }],
  });
  return rows.map(mapToCourse);
}

/** Devuelve un curso por su slug (o null si no existe). */
export async function getCourseBySlug(slug: string): Promise<UICourse | null> {
  const row = await prisma.course.findUnique({
    where: { slug },
    include: { temario: true },
  });
  return row ? mapToCourse(row) : null;
}

/** Sólo los slugs — para generateStaticParams. */
export async function getCourseSlugs(): Promise<string[]> {
  const rows = await prisma.course.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

/** Categorías únicas, útiles para los filtros del listado. */
export async function getCategories(): Promise<string[]> {
  const rows = await prisma.course.findMany({
    select:   { categoria: true },
    distinct: ["categoria"],
  });
  return rows.map((r) => r.categoria).sort();
}
