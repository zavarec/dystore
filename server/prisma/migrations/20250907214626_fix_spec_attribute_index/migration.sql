-- DropForeignKey
ALTER TABLE "public"."ProductBoxItem" DROP CONSTRAINT "ProductBoxItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductSpec" DROP CONSTRAINT "ProductSpec_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductSpec" DROP CONSTRAINT "ProductSpec_productId_fkey";

-- DropIndex
DROP INDEX "public"."ProductBoxItem_productId_idx";

-- DropIndex
DROP INDEX "public"."ProductSpec_productId_idx";

-- CreateIndex
CREATE INDEX "ProductBoxItem_productId_order_idx" ON "public"."ProductBoxItem"("productId", "order");

-- CreateIndex
CREATE INDEX "ProductSpec_productId_order_idx" ON "public"."ProductSpec"("productId", "order");

-- CreateIndex
CREATE INDEX "SpecAttribute_group_order_idx" ON "public"."SpecAttribute"("group", "order");

-- AddForeignKey
ALTER TABLE "public"."ProductBoxItem" ADD CONSTRAINT "ProductBoxItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSpec" ADD CONSTRAINT "ProductSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSpec" ADD CONSTRAINT "ProductSpec_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "public"."SpecAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
