/*
  Warnings:

  - You are about to drop the column `direccion_ip` on the `Pantallas` table. All the data in the column will be lost.
  - You are about to drop the column `direccion_mac` on the `Pantallas` table. All the data in the column will be lost.
  - The required column `key` was added to the `Pantallas` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Pantallas" DROP COLUMN "direccion_ip",
DROP COLUMN "direccion_mac",
ADD COLUMN     "key" TEXT NOT NULL;
