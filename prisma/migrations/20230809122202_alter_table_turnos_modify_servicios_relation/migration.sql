-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_servicio_destino_id_fkey";

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_servicio_actual_id_fkey" FOREIGN KEY ("servicio_actual_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
