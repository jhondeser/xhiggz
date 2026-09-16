-- AlterTable
ALTER TABLE "CourseModule" ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "moduloDesbloqueado" INTEGER NOT NULL DEFAULT 1;
