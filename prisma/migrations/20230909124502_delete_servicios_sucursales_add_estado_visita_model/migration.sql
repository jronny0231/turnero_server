/*
  Warnings:

  - You are about to drop the `Servicios_sucursales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Servicios_sucursales" DROP CONSTRAINT "Servicios_sucursales_servicio_id_fkey";

-- DropForeignKey
ALTER TABLE "Servicios_sucursales" DROP CONSTRAINT "Servicios_sucursales_sucursal_id_fkey";

-- AlterTable
ALTER TABLE "Servicios_departamentos_sucursales" ADD COLUMN     "disponible" BOOLEAN DEFAULT true,
ADD COLUMN     "razon_no_disponible" VARCHAR(100);

-- AlterTable
ALTER TABLE "Visitas_agendadas" ADD COLUMN     "estado_visita_id" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "Servicios_sucursales";

-- CreateTable
CREATE TABLE "Estado_visita" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(15) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "color_hex" VARCHAR(7) NOT NULL,

    CONSTRAINT "Estado_visita_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visitas_agendadas" ADD CONSTRAINT "Visitas_agendadas_estado_visita_id_fkey" FOREIGN KEY ("estado_visita_id") REFERENCES "Estado_visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
