/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id]` on the table `Agentes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Direcciones" ALTER COLUMN "latitud_decimal" DROP NOT NULL,
ALTER COLUMN "longitud_decimal" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agentes_usuario_id_key" ON "Agentes"("usuario_id");
