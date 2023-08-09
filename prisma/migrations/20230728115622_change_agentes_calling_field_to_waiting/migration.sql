/*
  Warnings:

  - You are about to drop the column `llamando` on the `Agentes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agentes" DROP COLUMN "llamando",
ADD COLUMN     "esperando" BOOLEAN DEFAULT false;
