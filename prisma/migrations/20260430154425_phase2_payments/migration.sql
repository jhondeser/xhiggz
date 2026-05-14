/*
  Warnings:

  - You are about to drop the column `stripePriceIdOneTime` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripePriceIdMonthly]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePriceIdYearly]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_stripePriceIdOneTime_key";

-- DropIndex
DROP INDEX "Course_stripeProductId_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "stripePriceIdOneTime",
DROP COLUMN "stripeProductId",
ADD COLUMN     "stripePriceIdMonthly" TEXT,
ADD COLUMN     "stripePriceIdYearly" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripePriceIdMonthly_key" ON "Course"("stripePriceIdMonthly");

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripePriceIdYearly_key" ON "Course"("stripePriceIdYearly");

-- CreateIndex
CREATE INDEX "Subscription_courseId_idx" ON "Subscription"("courseId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
