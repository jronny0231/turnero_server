/*
  Warnings:

  - You are about to drop the column `departamentos_sucursal_id` on the `Agentes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "tipo_turno" AS ENUM ('NORMAL', 'AGENDADO', 'PREFERENCIAL');

-- DropForeignKey
ALTER TABLE "Agentes" DROP CONSTRAINT "Agentes_departamentos_sucursal_id_fkey";

-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "departamentos_sucursal_id",
ADD COLUMN     "departamento_sucursal_id" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Turnos" ADD COLUMN     "tipo_turno" "tipo_turno" NOT NULL DEFAULT 'NORMAL',
ALTER COLUMN "secuencia_ticket" SET DATA TYPE VARCHAR(10);

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_departamento_sucursal_id_fkey" FOREIGN KEY ("departamento_sucursal_id") REFERENCES "Departamentos_sucursales"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
