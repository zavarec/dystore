-- CreateEnum
CREATE TYPE "public"."PromoEntityType" AS ENUM ('CATEGORY_PROMO_SECTION');

-- CreateEnum
CREATE TYPE "public"."PromoPageType" AS ENUM ('CATEGORY', 'PRODUCT', 'LANDING', 'STATIC');

-- CreateTable
CREATE TABLE "public"."PromoPlacement" (
    "id" SERIAL NOT NULL,
    "pageType" "public"."PromoPageType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "slot" "public"."CategoryPromoPlacement" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "entityType" "public"."PromoEntityType" NOT NULL,
    "categoryPromoSectionId" INTEGER,
    "fullWidth" BOOLEAN,
    "marginTop" INTEGER,
    "marginBottom" INTEGER,
    "bgColor" TEXT,
    "contentSide" "public"."ContentSide",
    "zIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoPlacement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromoPlacement_pageType_entityId_slot_isActive_order_idx" ON "public"."PromoPlacement"("pageType", "entityId", "slot", "isActive", "order");

-- AddForeignKey
ALTER TABLE "public"."PromoPlacement" ADD CONSTRAINT "PromoPlacement_categoryPromoSectionId_fkey" FOREIGN KEY ("categoryPromoSectionId") REFERENCES "public"."CategoryPromoSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
