/*
  Warnings:

  - The primary key for the `Servicios_departamentos_sucursales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `departamento_sucursal_id` on the `Servicios_departamentos_sucursales` table. All the data in the column will be lost.
  - Added the required column `departamento_sucursal_refId` to the `Servicios_departamentos_sucursales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Servicios_departamentos_sucursales" DROP CONSTRAINT "Servicios_departamentos_sucursales_departamento_sucursal_i_fkey";

-- AlterTable
ALTER TABLE "Servicios_departamentos_sucursales" DROP CONSTRAINT "Servicios_departamentos_sucursales_pkey",
DROP COLUMN "departamento_sucursal_id",
ADD COLUMN     "departamento_sucursal_refId" INTEGER NOT NULL,
ADD CONSTRAINT "Servicios_departamentos_sucursales_pkey" PRIMARY KEY ("servicio_id", "departamento_sucursal_refId");

-- AddForeignKey
ALTER TABLE "Servicios_departamentos_sucursales" ADD CONSTRAINT "Servicios_departamentos_sucursales_departamento_sucursal_r_fkey" FOREIGN KEY ("departamento_sucursal_refId") REFERENCES "Departamentos_sucursales"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
