/*
  Warnings:

  - A unique constraint covering the columns `[clave]` on the table `Configuraciones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Configuraciones_clave_key" ON "Configuraciones"("clave");
