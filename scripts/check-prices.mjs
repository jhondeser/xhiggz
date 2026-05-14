// scripts/check-prices.mjs
//
// Diagnóstico: muestra el estado actual de los Stripe price IDs por curso en
// la BD. Útil para saber rápido qué cursos están listos para checkout y
// cuáles necesitan que les sincronices o pongas el price.
//
// Uso:
//   node scripts/check-prices.mjs
//
// Salida ejemplo:
//   ✓ minecraft-education-basico              monthly: price_xxx     yearly: price_yyy
//   ⚠ programacion-web-intermedio-...         monthly: price_zzz     yearly: (vacío)
//   ✗ programacion-web-avanzado-...           monthly: (vacío)        yearly: (vacío)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      stripePriceIdMonthly: true,
      stripePriceIdYearly: true,
    },
    orderBy: { id: "asc" },
  });

  console.log(`\nCursos en BD: ${courses.length}\n`);
  console.log("─".repeat(110));

  let ready = 0, partial = 0, missing = 0;

  for (const c of courses) {
    const m = c.stripePriceIdMonthly;
    const y = c.stripePriceIdYearly;

    let icon = "✓";
    if (!m && !y)        { icon = "✗"; missing++; }
    else if (!m || !y)   { icon = "⚠"; partial++; }
    else                 {              ready++; }

    const slug = c.slug.padEnd(50);
    const monthly = (m || "(vacío)").padEnd(30);
    const yearly  = (y || "(vacío)").padEnd(30);
    console.log(`  ${icon}  ${slug}  M:${monthly}  Y:${yearly}`);
  }

  console.log("─".repeat(110));
  console.log(`\nResumen: ${ready} listos · ${partial} parciales · ${missing} sin precios\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
