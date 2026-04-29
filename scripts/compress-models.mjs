#!/usr/bin/env node
// scripts/compress-models.mjs
//
// Comprime todos los .glb de public/models y los escribe en public/models-optimized.
// Aplica:
//   - Draco geometry compression (reduce vertices/índices, ~70-90% en geometría)
//   - WebP texture compression (reduce texturas, suele ser el mayor ahorro)
//   - prune (elimina datos huérfanos)
//   - dedup (deduplicación de mesh/textura)
//   - resample (optimiza animaciones si las hay)
//
// Uso:   node scripts/compress-models.mjs
// Re-correr es seguro: sobrescribe los archivos en models-optimized.

import { readdirSync, statSync, mkdirSync, existsSync, openSync, readSync, closeSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Devuelve true si el .glb ya tiene Draco aplicado.
// Los GLB declaran sus extensiones en un chunk JSON al principio del archivo.
// Buscamos "KHR_draco_mesh_compression" en los primeros 64 KB — suficiente
// para cualquier GLB realista.
function isAlreadyCompressed(filePath) {
  const fd = openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(64 * 1024);
    const bytes = readSync(fd, buf, 0, buf.length, 0);
    return buf.slice(0, bytes).includes("KHR_draco_mesh_compression");
  } finally {
    closeSync(fd);
  }
}

// Convertimos import.meta.url -> ruta del sistema de archivos.
// fileURLToPath maneja correctamente Windows ("file:///C:/..." -> "C:\...").
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INPUT_DIR = path.join(ROOT, "public", "models");
const OUTPUT_DIR = path.join(ROOT, "public", "models-optimized");

if (!existsSync(INPUT_DIR)) {
  console.error(`No existe ${INPUT_DIR}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(INPUT_DIR).filter((f) => f.toLowerCase().endsWith(".glb"));

if (files.length === 0) {
  console.error(`No hay archivos .glb en ${INPUT_DIR}`);
  process.exit(1);
}

const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

console.log(`\nComprimiendo ${files.length} modelos de ${INPUT_DIR}\n`);
console.log(`Salida: ${OUTPUT_DIR}\n`);
console.log("─".repeat(60));

let totalBefore = 0;
let totalAfter = 0;
const failures = [];
const skipped = [];

for (const file of files) {
  const input = path.join(INPUT_DIR, file);
  const output = path.join(OUTPUT_DIR, file);
  const sizeBefore = statSync(input).size;
  totalBefore += sizeBefore;

  console.log(`\n▶ ${file}  (${formatMB(sizeBefore)} MB)`);

  // Salta archivos ya comprimidos para no degradar la calidad ni perder
  // tiempo. Si quieres forzar una recompresión, pasa --force.
  if (isAlreadyCompressed(input) && !process.argv.includes("--force")) {
    console.log(`  ↷ ya tiene Draco, saltando (usa --force para recomprimir)`);
    skipped.push(file);
    totalAfter += sizeBefore;
    continue;
  }

  // Usamos npx para no añadir gltf-transform a las dependencias del proyecto:
  // es una herramienta de build/optimización que sólo se usa offline.
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "@gltf-transform/cli@4",
      "optimize",
      input,
      output,
      "--compress", "draco",
      "--texture-compress", "webp",
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    }
  );

  if (result.status !== 0) {
    console.error(`  ✗ Error procesando ${file}`);
    if (result.stderr) console.error(result.stderr.toString());
    failures.push(file);
    continue;
  }

  const sizeAfter = statSync(output).size;
  totalAfter += sizeAfter;
  const savings = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
  console.log(`  ✓ ${formatMB(sizeAfter)} MB  (-${savings}%)`);
}

console.log("\n" + "─".repeat(60));
console.log("\nResumen:");
console.log(`  Antes:    ${formatMB(totalBefore)} MB`);
console.log(`  Después:  ${formatMB(totalAfter)} MB`);
const totalSavings = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : 0;
console.log(`  Ahorro:   ${formatMB(totalBefore - totalAfter)} MB (-${totalSavings}%)`);

if (skipped.length > 0) {
  console.log(`\n  Saltados (ya comprimidos): ${skipped.length}`);
}

if (failures.length > 0) {
  console.error(`\n⚠ Fallaron ${failures.length}: ${failures.join(", ")}`);
  process.exit(1);
}

console.log("\nSiguiente paso:");
console.log("  1. Revisa los modelos comprimidos en public/models-optimized/");
console.log("  2. Para probar visualmente, edita src/components/three/modelRegistry.tsx");
console.log("     y cambia '/models/' por '/models-optimized/' temporalmente.");
console.log("  3. Si todo se ve bien, sustituye los originales.\n");
