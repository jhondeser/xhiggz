import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const courses = await prisma.course.findMany({
    select: {
      slug: true, title: true, precioMensual: true, precioCompleto: true,
      precioMoneda: true, stripePriceIdMonthly: true, stripePriceIdYearly: true,
    },
    orderBy: { id: 'asc' },
  })
  for (const c of courses) {
    console.log(`${c.slug} | ${c.title} | mensual=${c.precioMensual} completo=${c.precioCompleto} ${c.precioMoneda} | monthlyId(test)=${c.stripePriceIdMonthly ?? '—'} yearlyId(test)=${c.stripePriceIdYearly ?? '—'}`)
  }
  console.log(`\nTotal: ${courses.length}`)
}
main().finally(() => prisma.$disconnect())
