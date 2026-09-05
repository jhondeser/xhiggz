// scripts/stripe-delete-customers.ts
//
// Borra TODOS los customers del entorno de TEST de Stripe.
// Productos, precios y webhooks quedan intactos.
//
// Uso:
//   npx tsx scripts/stripe-delete-customers.ts
//
// ⚠️  Solo funciona con sk_test_*. El script aborta si detecta una clave live.

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const key = process.env.STRIPE_SECRET_KEY ?? ''

if (!key.startsWith('sk_test_')) {
  console.error('❌  STRIPE_SECRET_KEY no es de test (sk_test_*). Abortando.')
  process.exit(1)
}

const stripe = new Stripe(key)

async function main() {
  console.log('🧹  Borrando customers de Stripe TEST…\n')

  let deleted = 0
  let startingAfter: string | undefined

  while (true) {
    const page = await stripe.customers.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    })

    if (page.data.length === 0) break

    for (const customer of page.data) {
      try {
        await stripe.customers.del(customer.id)
        console.log(`  ✓  ${customer.email ?? '(sin email)'}  (${customer.id})`)
        deleted++
      } catch (err) {
        console.warn(`  ⚠️  No se pudo borrar ${customer.id}:`, err)
      }
    }

    if (!page.has_more) break
    startingAfter = page.data[page.data.length - 1].id
  }

  console.log(`\n✨  Listo: ${deleted} customers eliminados.`)
  console.log('   Productos y precios intactos.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
