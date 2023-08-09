/*
  Warnings:

  - You are about to drop the column `estatus` on the `Servicios_dependientes` table. All the data in the column will be lost.
  - You are about to drop the column `prioridad` on the `Servicios_dependientes` table. All the data in the column will be lost.
  - You are about to drop the column `protocolo_id` on the `Servicios_dependientes` table. All the data in the column will be lost.
  - You are about to drop the column `razon_por_realizar` on the `Servicios_dependientes` table. All the data in the column will be lost.
  - You are about to drop the column `servicio_dependiente_id` on the `Servicios_dependientes` table. All the data in the column will be lost.
  - You are about to drop the column `servicio_seleccionable_id` on the `Servicios_dependientes` table. All the data in the column will be lost.
  - Added the required column `serie_servicios` to the `Servicios_dependientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turno_id` to the `Servicios_dependientes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Servicios_dependientes" DROP CONSTRAINT "Servicios_dependientes_protocolo_id_fkey";

-- DropForeignKey
ALTER TABLE "Servicios_dependientes" DROP CONSTRAINT "Servicios_dependientes_servicio_dependiente_id_fkey";

-- AlterTable
ALTER TABLE "Servicios_dependientes" DROP COLUMN "estatus",
DROP COLUMN "prioridad",
DROP COLUMN "protocolo_id",
DROP COLUMN "razon_por_realizar",
DROP COLUMN "servicio_dependiente_id",
DROP COLUMN "servicio_seleccionable_id",
ADD COLUMN     "serie_servicios" JSONB NOT NULL,
ADD COLUMN     "turno_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Servicios_dependientes" ADD CONSTRAINT "Servicios_dependientes_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "Turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
