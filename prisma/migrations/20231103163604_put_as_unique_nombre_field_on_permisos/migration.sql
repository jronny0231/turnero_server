/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Permisos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permisos_nombre_key" ON "Permisos"("nombre");
