-- AlterTable
ALTER TABLE "CourseModule" ADD COLUMN "publicado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "moduloDesbloqueado";
