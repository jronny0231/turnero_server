/*
  Warnings:

  - Added the required column `slug` to the `Grabaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Recursos_multimedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Departamentos" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(30);

-- AlterTable
CREATE SEQUENCE departamentos_sucursales_refid_seq;
ALTER TABLE "Departamentos_sucursales" ALTER COLUMN "refId" SET DEFAULT nextval('departamentos_sucursales_refid_seq');
ALTER SEQUENCE departamentos_sucursales_refid_seq OWNED BY "Departamentos_sucursales"."refId";

-- AlterTable
ALTER TABLE "Estilos_pantallas" ALTER COLUMN "detalle" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "Grabaciones" ADD COLUMN     "slug" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "Protocolos" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "Recursos_multimedia" ADD COLUMN     "slug" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "Roles" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "Sucursales" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "siglas" SET DATA TYPE VARCHAR(8);
