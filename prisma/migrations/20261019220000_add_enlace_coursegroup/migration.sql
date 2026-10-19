-- CourseGroup.enlace: enlace de Google Meet de cada grupo (lo lee n8n para
-- los recordatorios). Solo aditiva y nullable: no toca datos existentes.

-- AlterTable
ALTER TABLE "CourseGroup" ADD COLUMN "enlace" TEXT;
