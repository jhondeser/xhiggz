// prisma/seed.ts
//
// Script de seed: pobla la base de datos con los cursos definidos en
// prisma/seed-data/cursos.ts. Esa es la "fuente de verdad" para datos
// iniciales; la app de producción lee siempre desde la BD.
//
// Uso:
//   npx prisma db seed
//
// Es idempotente: usa `upsert` por slug, así que lo puedes correr varias veces
// y siempre dejará la BD en el estado del archivo cursos.

import { PrismaClient, Nivel } from "@prisma/client";
import { courses as sourceCourses } from "./seed-data/cursos";

const prisma = new PrismaClient();

// Mapeo del string nivel ("Todos los niveles") al enum Prisma (TodosLosNiveles).
function mapNivel(nivel?: string): Nivel | null {
  if (!nivel) return null;
  switch (nivel) {
    case "Principiante": return Nivel.Principiante;
    case "Intermedio":   return Nivel.Intermedio;
    case "Avanzado":     return Nivel.Avanzado;
    case "Todos los niveles": return Nivel.TodosLosNiveles;
    default: return null;
  }
}

async function main() {
  console.log(`\nSeeding ${sourceCourses.length} cursos...\n`);

  for (const c of sourceCourses) {
    const data = {
      slug:        c.slug,
      title:       c.title,
      description: c.description,
      emoji:       c.emoji,
      modelKey:    c.modelKey,
      categoria:   c.categoria,
      img:         c.img,

      nivel:       mapNivel(c.nivel),
      duracion:    c.duracion,
      rating:      c.rating,
      estudiantes: c.estudiantes ?? 0,
      destacado:   c.destacado ?? false,
      tags:        c.tags ?? [],

      precioMensual:  c.precio?.mensual,
      precioCompleto: c.precio?.completo,
      precioMoneda:   c.precio?.moneda ?? "€",

      modulosCount:   c.contenido?.modulos,
      horas:          c.contenido?.horas,
      proyectosCount: c.contenido?.proyectos,

      requisitos: c.requisitos ?? [],
      objetivos:  c.objetivos ?? [],
      beneficios: c.beneficios ?? [],

      certificado:     c.certificado ?? false,
      accesoVitalicio: c.accesoVitalicio ?? false,
      soporte:         c.soporte ?? false,
      comunidad:       c.comunidad ?? false,

      satisfaccion:  c.estadisticas?.satisfaccion,
      empleabilidad: c.estadisticas?.empleabilidad,
      completacion:  c.estadisticas?.completacion,

      fechaInicio: c.fechaInicio ? new Date(c.fechaInicio) : null,
      fechaFin:    c.fechaFin    ? new Date(c.fechaFin)    : null,

      instructorNombre:      c.instructor?.nombre,
      instructorAvatar:      c.instructor?.avatar,
      instructorRol:         c.instructor?.rol,
      instructorExperiencia: c.instructor?.experiencia,
    };

    // Upsert por slug. Si el curso ya existe, lo actualiza; si no, lo crea.
    const course = await prisma.course.upsert({
      where:  { slug: c.slug },
      create: data,
      update: data,
    });

    // Reemplazo del temario completo (más simple que diff):
    // borramos los módulos viejos y volvemos a crear desde el seed-data.
    await prisma.courseModule.deleteMany({ where: { courseId: course.id } });

    if (c.temario && c.temario.length > 0) {
      await prisma.courseModule.createMany({
        data: c.temario.map((m, i) => ({
          courseId: course.id,
          modulo:   m.modulo,
          semanas:  m.semanas,
          temas:    m.temas ?? [],
          orden:    i,
        })),
      });
    }

    console.log(`  ✓ ${c.slug}  (${c.temario?.length ?? 0} módulos)`);
  }

  console.log(`\n✓ Seed completado.\n`);
}

main()
  .catch((e) => {
    console.error("Seed falló:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
