/*
  Warnings:

  - You are about to drop the column `servicio_id` on the `Agentes` table. All the data in the column will be lost.
  - Added the required column `grupo_servicio_id` to the `Agentes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agentes" DROP CONSTRAINT "Agentes_servicio_id_fkey";

-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "servicio_id",
ADD COLUMN     "grupo_servicio_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_grupo_servicio_id_fkey" FOREIGN KEY ("grupo_servicio_id") REFERENCES "Grupos_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
