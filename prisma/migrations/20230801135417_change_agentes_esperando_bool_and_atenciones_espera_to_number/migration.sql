/*
  Warnings:

  - You are about to drop the column `esperando_servicio_id` on the `Agentes` table. All the data in the column will be lost.
  - You are about to drop the column `tiempo_espera` on the `Atenciones_turnos_servicios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "esperando_servicio_id",
ADD COLUMN     "esperando" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Atenciones_turnos_servicios" DROP COLUMN "tiempo_espera",
ADD COLUMN     "espera_segundos" INTEGER;
