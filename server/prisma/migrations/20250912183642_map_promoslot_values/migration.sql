/*
  Warnings:

  - You are about to drop the column `image` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `customImage` on the `ProductBoxItem` table. All the data in the column will be lost.
  - Changed the type of `slot` on the `PromoPlacement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PromoSlot" AS ENUM ('ABOVE_HERO', 'BELOW_HERO', 'ABOVE_SUBCATEGORIES', 'BELOW_SUBCATEGORIES', 'ABOVE_FILTERS', 'BELOW_FILTERS', 'ABOVE_PRODUCTS', 'BETWEEN_PRODUCTS', 'BELOW_PRODUCTS', 'PDP_FEATURES', 'PDP_BELOW_GALLERY', 'PDP_BELOW_SPECS', 'PDP_BELOW_ACCESSORY');

-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."FileStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'READY', 'ERROR');

-- CreateEnum
CREATE TYPE "public"."ProductMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "public"."Accessory" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "imageUrl",
ADD COLUMN     "dimensionsImageId" TEXT,
ADD COLUMN     "mainImageId" TEXT;

-- AlterTable
ALTER TABLE "public"."ProductBoxItem" DROP COLUMN "customImage",
ADD COLUMN     "customImageId" TEXT,
ADD COLUMN     "customImageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."PromoPlacement" DROP COLUMN "slot",
ADD COLUMN     "slot" "public"."PromoSlot" NOT NULL;

-- AlterTable
ALTER TABLE "public"."PromoSection" ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "videoId" TEXT;

-- AlterTable
ALTER TABLE "public"."Promotion" ADD COLUMN     "bgImageId" TEXT,
ADD COLUMN     "bgVideoId" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatarId" TEXT;

-- DropEnum
DROP TYPE "public"."CategoryPromoPlacement";

-- CreateTable
CREATE TABLE "public"."files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "public"."FileType" NOT NULL,
    "status" "public"."FileStatus" NOT NULL DEFAULT 'UPLOADING',
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "alt" TEXT,
    "description" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductMedia" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,
    "kind" "public"."ProductMediaType" NOT NULL DEFAULT 'IMAGE',
    "role" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    "title" TEXT,

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "files_uploadedById_idx" ON "public"."files"("uploadedById");

-- CreateIndex
CREATE INDEX "files_type_status_idx" ON "public"."files"("type", "status");

-- CreateIndex
CREATE INDEX "files_mimetype_idx" ON "public"."files"("mimetype");

-- CreateIndex
CREATE INDEX "ProductMedia_productId_kind_order_idx" ON "public"."ProductMedia"("productId", "kind", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ProductMedia_productId_order_key" ON "public"."ProductMedia"("productId", "order");

-- CreateIndex
CREATE INDEX "PromoPlacement_pageType_entityId_slot_isActive_order_idx" ON "public"."PromoPlacement"("pageType", "entityId", "slot", "isActive", "order");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_dimensionsImageId_fkey" FOREIGN KEY ("dimensionsImageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Accessory" ADD CONSTRAINT "Accessory_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductBoxItem" ADD CONSTRAINT "ProductBoxItem_customImageId_fkey" FOREIGN KEY ("customImageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_bgImageId_fkey" FOREIGN KEY ("bgImageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_bgVideoId_fkey" FOREIGN KEY ("bgVideoId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromoSection" ADD CONSTRAINT "PromoSection_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromoSection" ADD CONSTRAINT "PromoSection_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductMedia" ADD CONSTRAINT "ProductMedia_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductMedia" ADD CONSTRAINT "ProductMedia_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
