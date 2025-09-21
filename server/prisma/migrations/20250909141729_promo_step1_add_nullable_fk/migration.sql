/*
  Warnings:

  - You are about to drop the column `categoryPromoSectionId` on the `PromoPlacement` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `PromoPlacement` table. All the data in the column will be lost.
  - You are about to drop the `CategoryPromoSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PromoVariant" AS ENUM ('BANNER', 'TEXT_STRIP', 'TEXT_QUOTE', 'GRID', 'STRIP_USP', 'IMAGE_PAIR', 'HEADLINE_STRIP');

-- DropForeignKey
ALTER TABLE "public"."CategoryPromoSection" DROP CONSTRAINT "CategoryPromoSection_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CategoryPromoSection" DROP CONSTRAINT "CategoryPromoSection_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."PromoPlacement" DROP CONSTRAINT "PromoPlacement_categoryPromoSectionId_fkey";

-- AlterTable
ALTER TABLE "public"."PromoPlacement" DROP COLUMN "categoryPromoSectionId",
DROP COLUMN "entityType",
ADD COLUMN     "promoSectionId" INTEGER;

-- DropTable
DROP TABLE "public"."CategoryPromoSection";

-- DropEnum
DROP TYPE "public"."CategoryPromoVariant";

-- CreateTable
CREATE TABLE "public"."PromoSection" (
    "id" SERIAL NOT NULL,
    "variant" "public"."PromoVariant" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "font" "public"."PromoFont" DEFAULT 'NUNITO_SANS',
    "titleColor" TEXT,
    "textColor" TEXT,
    "ctaBg" TEXT,
    "ctaColor" TEXT,
    "bgColor" TEXT,
    "contentSide" "public"."ContentSide",
    "heightPx" INTEGER,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PromoPlacement" ADD CONSTRAINT "PromoPlacement_promoSectionId_fkey" FOREIGN KEY ("promoSectionId") REFERENCES "public"."PromoSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PromoSection" ADD CONSTRAINT "PromoSection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
