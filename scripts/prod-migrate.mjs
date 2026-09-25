// scripts/prod-migrate.mjs
//
// Ejecuta `prisma migrate status` o `prisma migrate deploy` contra PRODUCCIÓN
// sin editar el .env: lee la URL de producción de la línea comentada
// "# DATABASE_URL=...ep-broad-flower..." y la pasa solo a este proceso.
//
// Uso (desde la carpeta del proyecto):
//   node scripts/prod-migrate.mjs status
//   node scripts/prod-migrate.mjs deploy

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const PROD_HOST = "ep-broad-flower-abhaq7db";
const cmd = process.argv[2];
if (cmd !== "status" && cmd !== "deploy") {
  console.error("Uso: node scripts/prod-migrate.mjs status | deploy");
  process.exit(1);
}

const line = readFileSync(".env", "utf8")
  .split(/\r?\n/)
  .find((l) => /^#\s*DATABASE_URL=/.test(l) && l.includes(PROD_HOST));
if (!line) {
  console.error(`No encuentro la línea comentada "# DATABASE_URL=" con ${PROD_HOST} en .env`);
  process.exit(1);
}
const url = line.replace(/^#\s*DATABASE_URL=/, "").trim().replace(/^"|"$/g, "");

console.log(`\n>>> PRODUCCIÓN (${PROD_HOST}) — prisma migrate ${cmd}\n`);
const r = spawnSync(`npx prisma migrate ${cmd}`, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DATABASE_URL: url },
});
process.exit(r.status ?? 1);
