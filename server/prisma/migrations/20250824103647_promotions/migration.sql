-- CreateEnum
CREATE TYPE "public"."PromotionSlot" AS ENUM ('HERO', 'PRODUCT_OF_DAY', 'FEATURED', 'CUSTOM');

-- CreateTable
CREATE TABLE "public"."Promotion" (
    "id" SERIAL NOT NULL,
    "slot" "public"."PromotionSlot" NOT NULL,
    "productId" INTEGER,
    "title" TEXT,
    "subtitle" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "bgImageUrl" TEXT,
    "bgVideoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Promotion_slot_isPublished_startAt_endAt_idx" ON "public"."Promotion"("slot", "isPublished", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "Promotion_slot_position_idx" ON "public"."Promotion"("slot", "position");

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
