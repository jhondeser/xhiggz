/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('Principiante', 'Intermedio', 'Avanzado', 'TodosLosNiveles');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "accesoVitalicio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "beneficios" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "certificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completacion" DOUBLE PRECISION,
ADD COLUMN     "comunidad" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "destacado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "duracion" TEXT,
ADD COLUMN     "emoji" TEXT,
ADD COLUMN     "empleabilidad" DOUBLE PRECISION,
ADD COLUMN     "estudiantes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fechaFin" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3),
ADD COLUMN     "horas" INTEGER,
ADD COLUMN     "img" TEXT NOT NULL,
ADD COLUMN     "instructorAvatar" TEXT,
ADD COLUMN     "instructorExperiencia" TEXT,
ADD COLUMN     "instructorNombre" TEXT,
ADD COLUMN     "instructorRol" TEXT,
ADD COLUMN     "modelKey" TEXT,
ADD COLUMN     "modulosCount" INTEGER,
ADD COLUMN     "nivel" "Nivel",
ADD COLUMN     "objetivos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "precioCompleto" DOUBLE PRECISION,
ADD COLUMN     "precioMensual" DOUBLE PRECISION,
ADD COLUMN     "precioMoneda" TEXT DEFAULT '€',
ADD COLUMN     "proyectosCount" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "requisitos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "satisfaccion" DOUBLE PRECISION,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "soporte" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "instructorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CourseModule" (
    "id" SERIAL NOT NULL,
    "modulo" TEXT NOT NULL,
    "semanas" TEXT NOT NULL,
    "temas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "orden" INTEGER NOT NULL DEFAULT 0,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseModule_courseId_idx" ON "CourseModule"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_categoria_idx" ON "Course"("categoria");

-- CreateIndex
CREATE INDEX "Course_destacado_idx" ON "Course"("destacado");

-- CreateIndex
CREATE INDEX "Course_nivel_idx" ON "Course"("nivel");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
