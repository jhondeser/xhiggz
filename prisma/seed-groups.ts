// prisma/seed-groups.ts
//
// Crea los grupos iniciales de cada curso según la tabla de slots de Xhiggz.
//
// Uso:
//   npx tsx prisma/seed-groups.ts
//
// El script es idempotente: si un grupo (courseId + dia + franja + nombre)
// ya existe, lo omite. Puedes ejecutarlo varias veces sin duplicar datos.

import { PrismaClient } from '@prisma/client'
import { GRUPOS_SEED, getHorario } from '../src/lib/schedule'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding course groups…\n')

  let created = 0
  let skipped = 0

  for (const item of GRUPOS_SEED) {
    const course = await prisma.course.findUnique({
      where: { slug: item.cursoSlug },
      select: { id: true, title: true },
    })

    if (!course) {
      console.warn(`  ⚠️  Curso no encontrado: "${item.cursoSlug}" — omitido`)
      skipped++
      continue
    }

    const horario = getHorario(item.franja, item.dia)

    // Busca si ya existe este grupo exacto (por courseId + día + franja + nombre)
    const existing = await prisma.courseGroup.findFirst({
      where: {
        courseId: course.id,
        dia: item.dia,
        franja: item.franja,
        nombre: item.nombre,
      },
    })

    if (existing) {
      console.log(`  ↩  "${item.cursoSlug}" ${item.nombre} (${item.dia}-${item.franja}) ya existe — omitido`)
      skipped++
      continue
    }

    await prisma.courseGroup.create({
      data: {
        courseId: course.id,
        nombre: item.nombre,
        dia: item.dia,
        franja: item.franja,
        horaInicio: horario.inicio,
        horaFin: horario.fin,
        plazasTotal: item.plazasTotal,
        plazasOcupadas: 0,
        activo: true,
      },
    })

    console.log(`  ✅  "${course.title}" ${item.nombre} → ${item.dia} ${horario.inicio}–${horario.fin} (${item.plazasTotal} plazas)`)
    created++
  }

  console.log(`\n✨ Listo: ${created} creados, ${skipped} omitidos.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
