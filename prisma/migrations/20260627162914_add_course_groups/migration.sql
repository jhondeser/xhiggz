-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "groupId" INTEGER;

-- CreateTable
CREATE TABLE "CourseGroup" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "franja" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "plazasTotal" INTEGER NOT NULL DEFAULT 10,
    "plazasOcupadas" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseGroup_courseId_idx" ON "CourseGroup"("courseId");

-- CreateIndex
CREATE INDEX "CourseGroup_activo_idx" ON "CourseGroup"("activo");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseGroup" ADD CONSTRAINT "CourseGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
