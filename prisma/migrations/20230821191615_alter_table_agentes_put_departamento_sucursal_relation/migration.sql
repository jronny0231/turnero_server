/*
  Warnings:

  - You are about to drop the column `sucursal_id` on the `Agentes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agentes" DROP CONSTRAINT "Agentes_sucursal_id_fkey";

-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "sucursal_id",
ADD COLUMN     "departamentos_sucursal_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_departamentos_sucursal_id_fkey" FOREIGN KEY ("departamentos_sucursal_id") REFERENCES "Departamentos_sucursales"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
