-- CreateEnum
CREATE TYPE "public"."PromoFont" AS ENUM ('INTER', 'ROBOTO', 'MONTSERRAT', 'POPPINS');

-- CreateEnum
CREATE TYPE "public"."PageKey" AS ENUM ('HOME');

-- CreateEnum
CREATE TYPE "public"."SectionKey" AS ENUM ('PRODUCT_OF_DAY', 'FEATURED', 'CUSTOM', 'HITS');

-- AlterTable
ALTER TABLE "public"."Promotion" ADD COLUMN     "ctaBg" TEXT,
ADD COLUMN     "ctaColor" TEXT,
ADD COLUMN     "font" "public"."PromoFont",
ADD COLUMN     "textColor" TEXT,
ADD COLUMN     "titleColor" TEXT;

-- CreateTable
CREATE TABLE "public"."PageSection" (
    "id" SERIAL NOT NULL,
    "page" "public"."PageKey" NOT NULL,
    "key" "public"."SectionKey" NOT NULL,
    "title" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "settings" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageSection_page_isEnabled_position_idx" ON "public"."PageSection"("page", "isEnabled", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PageSection_page_key_key" ON "public"."PageSection"("page", "key");

-- AddForeignKey
ALTER TABLE "public"."PageSection" ADD CONSTRAINT "PageSection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
