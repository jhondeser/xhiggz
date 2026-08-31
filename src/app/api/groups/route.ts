// src/app/api/groups/route.ts
//
// GET /api/groups?slug=<course-slug>
// Devuelve los grupos activos de un curso, ordenados por día y franja.
// Usado en el paso 2 del dialog de checkout para mostrar horarios y plazas.

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { diaIndex } from '@/lib/schedule'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'slug requerido' }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    const groups = await prisma.courseGroup.findMany({
      where: { courseId: course.id, activo: true },
      select: {
        id: true,
        nombre: true,
        dia: true,
        franja: true,
        horaInicio: true,
        horaFin: true,
        plazasTotal: true,
        plazasOcupadas: true,
      },
    })

    // Ordenar: primero por día (Lunes → Sábado), luego por franja (A → C)
    groups.sort((a, b) => {
      const dDiff = diaIndex(a.dia) - diaIndex(b.dia)
      if (dDiff !== 0) return dDiff
      return a.franja.localeCompare(b.franja)
    })

    return NextResponse.json({ groups })
  } catch (err) {
    console.error('[api/groups] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
