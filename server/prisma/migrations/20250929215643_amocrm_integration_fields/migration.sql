/*
  Warnings:

  - A unique constraint covering the columns `[amoCatalogElementId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."OrderSource" AS ENUM ('WEBSITE', 'CHAT_WIDGET', 'TELEGRAM', 'CALL', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "amoCatalogElementId" INTEGER;

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "amoContactId" INTEGER,
ADD COLUMN     "amoLeadId" INTEGER,
ADD COLUMN     "amoPipelineId" INTEGER,
ADD COLUMN     "amoStatusId" INTEGER,
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "source" "public"."OrderSource" NOT NULL DEFAULT 'WEBSITE';

-- CreateIndex
CREATE UNIQUE INDEX "Product_amoCatalogElementId_key" ON "public"."Product"("amoCatalogElementId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "public"."orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_amoLeadId_idx" ON "public"."orders"("amoLeadId");

-- CreateIndex
CREATE INDEX "orders_amoContactId_idx" ON "public"."orders"("amoContactId");
