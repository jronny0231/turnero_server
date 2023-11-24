/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Permisos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Permisos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permisos" ADD COLUMN     "slug" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permisos_slug_key" ON "Permisos"("slug");
