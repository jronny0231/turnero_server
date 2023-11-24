/*
  Warnings:

  - Made the column `descripcion` on table `Permisos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Permisos" ALTER COLUMN "descripcion" SET NOT NULL;
