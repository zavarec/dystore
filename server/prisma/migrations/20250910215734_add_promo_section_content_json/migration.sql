-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."CategoryPromoPlacement" ADD VALUE 'PDP_FEATURES';
ALTER TYPE "public"."CategoryPromoPlacement" ADD VALUE 'PDP_BELOW_GALLERY';
ALTER TYPE "public"."CategoryPromoPlacement" ADD VALUE 'PDP_BELOW_SPECS';
ALTER TYPE "public"."CategoryPromoPlacement" ADD VALUE 'PDP_BELOW_ACCESSORY';

-- AlterEnum
ALTER TYPE "public"."PromoVariant" ADD VALUE 'CAROUSEL';

-- AlterTable
ALTER TABLE "public"."PromoSection" ADD COLUMN     "content" JSONB,
ADD COLUMN     "titleFontSizePx" INTEGER;
