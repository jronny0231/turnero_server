/*
  Warnings:

  - You are about to drop the column `esperando` on the `Agentes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "esperando",
ADD COLUMN     "esperando_servicio_id" INTEGER;
