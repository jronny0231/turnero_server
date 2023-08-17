/*
  Warnings:

  - Added the required column `servicio_destino_id` to the `Servicios_seguros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servicios_seguros" ADD COLUMN     "servicio_destino_id" INTEGER NOT NULL;
