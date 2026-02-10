/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `fileUrlEn` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrlFr` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "fileUrl",
DROP COLUMN "title",
ADD COLUMN     "fileUrlEn" TEXT NOT NULL,
ADD COLUMN     "fileUrlFr" TEXT NOT NULL;
