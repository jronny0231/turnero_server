-- AlterTable
ALTER TABLE "Servicios_dependientes" ALTER COLUMN "razon_por_realizar" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Servicios_seguros" ALTER COLUMN "cobertura" DROP NOT NULL;
