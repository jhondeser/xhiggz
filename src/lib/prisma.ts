// src/lib/prisma.ts
//
// Cliente Prisma singleton.
//
// En desarrollo, Next.js con Turbopack/HMR recarga módulos constantemente.
// Si creáramos `new PrismaClient()` en cada recarga, abriríamos una conexión
// nueva al Postgres y agotaríamos el pool en minutos.
//
// El truco es guardar la instancia en globalThis (que sí persiste entre
// recargas) sólo en development. En producción no hay HMR, así que cada
// proceso tiene su propio cliente.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
