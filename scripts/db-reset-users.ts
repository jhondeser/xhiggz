// scripts/db-reset-users.ts
//
// Limpia todos los datos de usuarios, pedidos y grupos de la BD
// SIN tocar los cursos, módulos ni precios.
//
// Tablas que borra (en orden para respetar FKs):
//   StripeEvent, Enrollment, Subscription, Order, Lead,
//   Testimonial, VerificationToken, User, CourseGroup
//
// Tablas que NO toca:
//   Course, CourseModule
//
// Uso:
//   npx tsx scripts/db-reset-users.ts

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function main() {
  console.log('🧹  Limpiando datos de usuarios en la BD…\n')

  const results = await prisma.$transaction([
    prisma.stripeEvent.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.order.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.verificationToken.deleteMany(),
    // Antes que User y CourseGroup: sus FKs son Restrict
    prisma.groupSession.deleteMany(),
    prisma.user.deleteMany(),
    prisma.courseGroup.deleteMany(),
  ])

  const labels = [
    'StripeEvents',
    'Enrollments',
    'Subscriptions',
    'Orders',
    'Leads',
    'Testimonials',
    'VerificationTokens',
    'GroupSessions',
    'Users',
    'CourseGroups',
  ]

  results.forEach((r, i) => console.log(`  ✓  ${labels[i]}: ${r.count} filas eliminadas`))

  console.log('\n✨  Listo. Cursos y módulos intactos.')
  console.log('\n⚠️  IMPORTANTE: los grupos fueron borrados.')
  console.log('   Corre ahora: npx tsx prisma/seed-groups.ts\n')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
