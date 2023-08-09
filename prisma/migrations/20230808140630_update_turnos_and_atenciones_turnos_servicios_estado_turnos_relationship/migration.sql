/*
  Warnings:

  - You are about to drop the column `estatus` on the `Atenciones_turnos_servicios` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_estado_turno_id_fkey";

-- AlterTable
ALTER TABLE "Atenciones_turnos_servicios" DROP COLUMN "estatus",
ADD COLUMN     "estado_turno_id" INTEGER DEFAULT 1,
ADD COLUMN     "estatus_llamada" "turno_llamada" NOT NULL DEFAULT 'UNCALLED';

-- AlterTable
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno_id" DROP NOT NULL,
ALTER COLUMN "estado_turno_id" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_estado_turno_id_fkey" FOREIGN KEY ("estado_turno_id") REFERENCES "Estados_turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atenciones_turnos_servicios" ADD CONSTRAINT "Atenciones_turnos_servicios_estado_turno_id_fkey" FOREIGN KEY ("estado_turno_id") REFERENCES "Estados_turnos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
