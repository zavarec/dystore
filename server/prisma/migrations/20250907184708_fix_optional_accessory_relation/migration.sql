-- CreateEnum
CREATE TYPE "public"."SpecType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN');

-- CreateTable
CREATE TABLE "public"."Accessory" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductBoxItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "accessoryId" INTEGER,
    "customName" TEXT,
    "customImage" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductBoxItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SpecAttribute" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT,
    "type" "public"."SpecType" NOT NULL DEFAULT 'STRING',
    "group" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SpecAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductSpec" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueBool" BOOLEAN,
    "unitOverride" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductSpec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accessory_slug_key" ON "public"."Accessory"("slug");

-- CreateIndex
CREATE INDEX "ProductBoxItem_productId_idx" ON "public"."ProductBoxItem"("productId");

-- CreateIndex
CREATE INDEX "ProductBoxItem_accessoryId_idx" ON "public"."ProductBoxItem"("accessoryId");

-- CreateIndex
CREATE UNIQUE INDEX "SpecAttribute_key_key" ON "public"."SpecAttribute"("key");

-- CreateIndex
CREATE INDEX "ProductSpec_productId_idx" ON "public"."ProductSpec"("productId");

-- CreateIndex
CREATE INDEX "ProductSpec_attributeId_idx" ON "public"."ProductSpec"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSpec_productId_attributeId_key" ON "public"."ProductSpec"("productId", "attributeId");

-- AddForeignKey
ALTER TABLE "public"."ProductBoxItem" ADD CONSTRAINT "ProductBoxItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductBoxItem" ADD CONSTRAINT "ProductBoxItem_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "public"."Accessory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSpec" ADD CONSTRAINT "ProductSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSpec" ADD CONSTRAINT "ProductSpec_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "public"."SpecAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
