/*
  Warnings:

  - A unique constraint covering the columns `[parent_id]` on the table `Configuraciones` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Configuraciones" DROP CONSTRAINT "Configuraciones_modificado_por_id_fkey";

-- AlterTable
ALTER TABLE "Configuraciones" ADD COLUMN     "parent_id" INTEGER,
ALTER COLUMN "modificado_por_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Configuraciones_parent_id_key" ON "Configuraciones"("parent_id");

-- AddForeignKey
ALTER TABLE "Configuraciones" ADD CONSTRAINT "Configuraciones_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Configuraciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuraciones" ADD CONSTRAINT "Configuraciones_modificado_por_id_fkey" FOREIGN KEY ("modificado_por_id") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
