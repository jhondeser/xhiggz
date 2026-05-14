// scripts/sync-stripe-prices.ts
//
// Lee los productos de Stripe y rellena Course.stripePriceIdMonthly y
// Course.stripePriceIdYearly automáticamente, evitando copiar 40 IDs a mano.
//
// Estrategia de matching (en este orden):
//   1) product.metadata.xhiggz_slug === course.slug   ← preferido
//   2) product.name normalizado === course.title normalizado
//   3) product.name normalizado contiene course.slug
//
// Para cada producto matcheado:
//   - El price con recurring.interval='month' → stripePriceIdMonthly
//   - El price con type='one_time' o (recurring.interval='year' tratado como
//     anual one-time) → stripePriceIdYearly
//
// Uso:
//   npx tsx scripts/sync-stripe-prices.ts            # modo dry-run (no escribe)
//   npx tsx scripts/sync-stripe-prices.ts --apply    # aplica cambios a la BD

import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Falta STRIPE_SECRET_KEY en el .env");
  process.exit(1);
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProductPrices {
  productId: string;
  productName: string;
  metadataSlug?: string;
  monthly?: { id: string; amount: number };
  yearly?: { id: string; amount: number };
}

async function loadStripeProducts(): Promise<ProductPrices[]> {
  const out: ProductPrices[] = [];
  const products = await stripe.products.list({ active: true, limit: 100 });

  for (const product of products.data) {
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 20,
    });

    const entry: ProductPrices = {
      productId: product.id,
      productName: product.name,
      metadataSlug: product.metadata?.xhiggz_slug,
    };

    for (const price of prices.data) {
      const amount = price.unit_amount ?? 0;
      if (price.recurring?.interval === "month") {
        entry.monthly = { id: price.id, amount };
      } else if (
        price.type === "one_time" ||
        price.recurring?.interval === "year"
      ) {
        entry.yearly = { id: price.id, amount };
      }
    }

    out.push(entry);
  }

  return out;
}

interface MatchResult {
  course: { id: number; slug: string; title: string };
  product: ProductPrices;
  reason: "metadata" | "title" | "name-contains-slug";
}

async function main() {
  console.log(`\n=== sync-stripe-prices ${APPLY ? "(APPLY)" : "(dry-run)"} ===\n`);

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

  console.log(`Cursos en BD: ${courses.length}`);

  const products = await loadStripeProducts();
  console.log(`Productos activos en Stripe: ${products.length}\n`);

  const matches: MatchResult[] = [];
  const unmatchedCourses: typeof courses = [];
  const usedProductIds = new Set<string>();

  for (const course of courses) {
    const courseSlugN = normalize(course.slug);
    const courseTitleN = normalize(course.title);

    let match: MatchResult | undefined;

    // 1) metadata.xhiggz_slug
    const byMeta = products.find(
      (p) => !usedProductIds.has(p.productId) && p.metadataSlug && normalize(p.metadataSlug) === courseSlugN,
    );
    if (byMeta) match = { course, product: byMeta, reason: "metadata" };

    // 2) product name === course title
    if (!match) {
      const byTitle = products.find(
        (p) =>
          !usedProductIds.has(p.productId) &&
          normalize(p.productName) === courseTitleN,
      );
      if (byTitle) match = { course, product: byTitle, reason: "title" };
    }

    // 3) product name contiene course slug
    if (!match) {
      const byContains = products.find(
        (p) =>
          !usedProductIds.has(p.productId) &&
          normalize(p.productName).includes(courseSlugN),
      );
      if (byContains) match = { course, product: byContains, reason: "name-contains-slug" };
    }

    if (match) {
      matches.push(match);
      usedProductIds.add(match.product.productId);
    } else {
      unmatchedCourses.push(course);
    }
  }

  // Reporte
  console.log("─── Matches ───");
  for (const m of matches) {
    const monthly = m.product.monthly
      ? `${m.product.monthly.id} (${(m.product.monthly.amount / 100).toFixed(2)})`
      : "—";
    const yearly = m.product.yearly
      ? `${m.product.yearly.id} (${(m.product.yearly.amount / 100).toFixed(2)})`
      : "—";
    console.log(
      `  ✓ [${m.reason.padEnd(20)}] ${m.course.slug.padEnd(40)} → ${m.product.productName}`,
    );
    console.log(`      monthly: ${monthly}`);
    console.log(`      yearly:  ${yearly}`);
  }

  if (unmatchedCourses.length > 0) {
    console.log("\n─── Cursos SIN producto en Stripe ───");
    for (const c of unmatchedCourses) {
      console.log(`  ✗ ${c.slug} ("${c.title}")`);
    }
  }

  const unusedProducts = products.filter((p) => !usedProductIds.has(p.productId));
  if (unusedProducts.length > 0) {
    console.log("\n─── Productos en Stripe SIN curso ───");
    for (const p of unusedProducts) {
      console.log(`  ? ${p.productId} "${p.productName}"`);
    }
  }

  // Apply
  if (APPLY) {
    console.log("\n─── Actualizando BD ───");
    let updated = 0;
    for (const m of matches) {
      const newMonthly = m.product.monthly?.id ?? null;
      const newYearly = m.product.yearly?.id ?? null;

      const changedMonthly = newMonthly && newMonthly !== m.course.stripePriceIdMonthly;
      const changedYearly = newYearly && newYearly !== m.course.stripePriceIdYearly;

      if (!changedMonthly && !changedYearly) continue;

      await prisma.course.update({
        where: { id: m.course.id },
        data: {
          ...(changedMonthly ? { stripePriceIdMonthly: newMonthly } : {}),
          ...(changedYearly ? { stripePriceIdYearly: newYearly } : {}),
        },
      });
      updated++;
      console.log(`  ✓ ${m.course.slug} actualizado`);
    }
    console.log(`\nTotal cursos actualizados: ${updated}`);
  } else {
    console.log("\nDry-run: re-ejecuta con --apply para escribir en la BD.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
