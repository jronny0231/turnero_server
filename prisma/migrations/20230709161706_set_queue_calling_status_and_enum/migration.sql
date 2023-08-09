-- CreateEnum
CREATE TYPE "turno_llamada" AS ENUM ('UNCALLED', 'CALLING', 'CALLED');

-- AlterTable
ALTER TABLE "Atenciones_turnos_servicios" ADD COLUMN     "estatus" "turno_llamada" NOT NULL DEFAULT 'UNCALLED';
