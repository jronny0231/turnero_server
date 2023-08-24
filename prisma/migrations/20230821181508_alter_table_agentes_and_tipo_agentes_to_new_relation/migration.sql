/*
  Warnings:

  - You are about to drop the column `departamento_sucursal_id` on the `Agentes` table. All the data in the column will be lost.
  - You are about to drop the column `grupo_servicio_id` on the `Agentes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parent_id]` on the table `Permisos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Agentes" DROP CONSTRAINT "Agentes_departamento_sucursal_id_fkey";

-- DropForeignKey
ALTER TABLE "Agentes" DROP CONSTRAINT "Agentes_grupo_servicio_id_fkey";

-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "departamento_sucursal_id",
DROP COLUMN "grupo_servicio_id",
ADD COLUMN     "sucursal_id" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Permisos" ADD COLUMN     "descripcion" VARCHAR(100),
ADD COLUMN     "parent_id" INTEGER,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "Tipos_Agentes_Grupos_Servicios" (
    "tipo_agente_id" INTEGER NOT NULL,
    "grupo_servicio_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Tipos_Agentes_Grupos_Servicios_pkey" PRIMARY KEY ("tipo_agente_id","grupo_servicio_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permisos_parent_id_key" ON "Permisos"("parent_id");

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tipos_Agentes_Grupos_Servicios" ADD CONSTRAINT "Tipos_Agentes_Grupos_Servicios_tipo_agente_id_fkey" FOREIGN KEY ("tipo_agente_id") REFERENCES "Tipos_agentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tipos_Agentes_Grupos_Servicios" ADD CONSTRAINT "Tipos_Agentes_Grupos_Servicios_grupo_servicio_id_fkey" FOREIGN KEY ("grupo_servicio_id") REFERENCES "Grupos_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Permisos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
