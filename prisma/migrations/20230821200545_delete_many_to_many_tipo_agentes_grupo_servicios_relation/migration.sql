/*
  Warnings:

  - You are about to drop the `Tipos_Agentes_Grupos_Servicios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tipos_Agentes_Grupos_Servicios" DROP CONSTRAINT "Tipos_Agentes_Grupos_Servicios_grupo_servicio_id_fkey";

-- DropForeignKey
ALTER TABLE "Tipos_Agentes_Grupos_Servicios" DROP CONSTRAINT "Tipos_Agentes_Grupos_Servicios_tipo_agente_id_fkey";

-- AlterTable
ALTER TABLE "Tipos_agentes" ADD COLUMN     "grupo_servicio_id" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "Tipos_Agentes_Grupos_Servicios";

-- AddForeignKey
ALTER TABLE "Tipos_agentes" ADD CONSTRAINT "Tipos_agentes_grupo_servicio_id_fkey" FOREIGN KEY ("grupo_servicio_id") REFERENCES "Grupos_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
