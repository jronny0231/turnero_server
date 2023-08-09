-- AlterTable
ALTER TABLE "Atenciones_turnos_servicios" ADD COLUMN     "razon_cancelado_id" INTEGER;

-- CreateTable
CREATE TABLE "Razones_Cancelados" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,

    CONSTRAINT "Razones_Cancelados_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Atenciones_turnos_servicios" ADD CONSTRAINT "Atenciones_turnos_servicios_razon_cancelado_id_fkey" FOREIGN KEY ("razon_cancelado_id") REFERENCES "Razones_Cancelados"("id") ON DELETE SET NULL ON UPDATE CASCADE;
