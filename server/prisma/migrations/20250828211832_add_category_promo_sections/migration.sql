-- CreateEnum
CREATE TYPE "public"."CategoryPromoVariant" AS ENUM ('BANNER', 'TEXT', 'GRID', 'STRIP_USP', 'IMAGE_PAIR');

-- CreateEnum
CREATE TYPE "public"."CategoryPromoPlacement" AS ENUM ('ABOVE_HERO', 'BELOW_HERO', 'ABOVE_SUBCATEGORIES', 'BELOW_SUBCATEGORIES', 'ABOVE_FILTERS', 'BELOW_FILTERS', 'ABOVE_PRODUCTS', 'BETWEEN_PRODUCTS', 'BELOW_PRODUCTS');

-- CreateTable
CREATE TABLE "public"."CategoryPromoSection" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "variant" "public"."CategoryPromoVariant" NOT NULL,
    "placement" "public"."CategoryPromoPlacement" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT,
    "subtitle" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "font" "public"."PromoFont",
    "titleColor" TEXT,
    "textColor" TEXT,
    "ctaBg" TEXT,
    "ctaColor" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryPromoSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryPromoSection_categoryId_isActive_idx" ON "public"."CategoryPromoSection"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "CategoryPromoSection_placement_order_idx" ON "public"."CategoryPromoSection"("placement", "order");

-- AddForeignKey
ALTER TABLE "public"."CategoryPromoSection" ADD CONSTRAINT "CategoryPromoSection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryPromoSection" ADD CONSTRAINT "CategoryPromoSection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
