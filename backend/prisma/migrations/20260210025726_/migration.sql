/*
  Warnings:

  - A unique constraint covering the columns `[submitterIp]` on the table `Testimonial` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "submitterIp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_submitterIp_key" ON "Testimonial"("submitterIp");
