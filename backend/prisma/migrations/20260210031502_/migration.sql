/*
  Warnings:

  - You are about to drop the column `subject` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `submitterIp` on the `Testimonial` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Testimonial_submitterIp_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "subject";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "submitterIp";
