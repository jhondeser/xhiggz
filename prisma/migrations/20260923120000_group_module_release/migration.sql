-- Publicación de vídeos por grupo (GroupModuleRelease) en vez de global
-- (CourseModule.publicado).
--
-- Transacción explícita: si el backfill o la comprobación fallan, no se crea
-- la tabla ni se borra "publicado". Todo o nada.
BEGIN;

-- CreateTable
CREATE TABLE "GroupModuleRelease" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedById" INTEGER,

    CONSTRAINT "GroupModuleRelease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupModuleRelease_moduleId_idx" ON "GroupModuleRelease"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupModuleRelease_groupId_moduleId_key" ON "GroupModuleRelease"("groupId", "moduleId");

-- AddForeignKey
ALTER TABLE "GroupModuleRelease" ADD CONSTRAINT "GroupModuleRelease_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupModuleRelease" ADD CONSTRAINT "GroupModuleRelease_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupModuleRelease" ADD CONSTRAINT "GroupModuleRelease_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: cada módulo con publicado = true se libera para TODOS los grupos
-- de su curso (activos o no: activo = abierto a venta, puede tener alumnos).
-- publishedById queda NULL (origen: migración). Ningún alumno pierde acceso.
INSERT INTO "GroupModuleRelease" ("groupId", "moduleId")
SELECT g."id", m."id"
FROM "CourseModule" m
JOIN "CourseGroup" g ON g."courseId" = m."courseId"
WHERE m."publicado" = true
ON CONFLICT ("groupId", "moduleId") DO NOTHING;

-- Comprobación: si falta alguna combinación módulo publicado × grupo, aborta
-- (la transacción se revierte y "publicado" sigue intacto).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "CourseModule" m
    JOIN "CourseGroup" g ON g."courseId" = m."courseId"
    WHERE m."publicado" = true
      AND NOT EXISTS (
        SELECT 1 FROM "GroupModuleRelease" r
        WHERE r."groupId" = g."id" AND r."moduleId" = m."id"
      )
  ) THEN
    RAISE EXCEPTION 'Backfill GroupModuleRelease incompleto: abortando migración';
  END IF;
END $$;

-- AlterTable
ALTER TABLE "CourseModule" DROP COLUMN "publicado";

COMMIT;
