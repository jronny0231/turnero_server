-- DropForeignKey
ALTER TABLE "Pantallas" DROP CONSTRAINT "Pantallas_sucursal_id_fkey";

-- AddForeignKey
ALTER TABLE "Pantallas" ADD CONSTRAINT "Pantallas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
