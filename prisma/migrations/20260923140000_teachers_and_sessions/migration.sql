-- Plataforma de profesores, fase 1:
-- 1) CourseGroup.teacherId: un profesor (User role = TEACHER) por grupo.
--    Nullable = grupo aún sin profesor. Borrar el User deja el grupo sin profesor.
-- 2) GroupSession: una clase impartida por grupo y día. teacherId se guarda en
--    la sesión (no se deriva del grupo) porque es la base del pago.
--
-- Migración solo aditiva: no toca ni borra datos existentes.
BEGIN;

-- CreateEnum
CREATE TYPE "GroupSessionStatus" AS ENUM ('IMPARTIDA', 'ANULADA');

-- AlterTable
ALTER TABLE "CourseGroup" ADD COLUMN "teacherId" INTEGER;

-- CreateTable
CREATE TABLE "GroupSession" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "estado" "GroupSessionStatus" NOT NULL DEFAULT 'IMPARTIDA',
    "observaciones" TEXT,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseGroup_teacherId_idx" ON "CourseGroup"("teacherId");

-- CreateIndex
CREATE INDEX "GroupSession_teacherId_fecha_idx" ON "GroupSession"("teacherId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "GroupSession_groupId_fecha_key" ON "GroupSession"("groupId", "fecha");

-- AddForeignKey
ALTER TABLE "CourseGroup" ADD CONSTRAINT "CourseGroup_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSession" ADD CONSTRAINT "GroupSession_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSession" ADD CONSTRAINT "GroupSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSession" ADD CONSTRAINT "GroupSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
