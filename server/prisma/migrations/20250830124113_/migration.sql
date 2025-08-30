/*
  Warnings:

  - The values [TEXT] on the enum `CategoryPromoVariant` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CategoryPromoVariant_new" AS ENUM ('BANNER', 'TEXT_STRIP', 'TEXT_QUOTE', 'GRID', 'STRIP_USP', 'IMAGE_PAIR', 'HEADLINE_STRIP');
ALTER TABLE "public"."CategoryPromoSection" ALTER COLUMN "variant" TYPE "public"."CategoryPromoVariant_new" USING ("variant"::text::"public"."CategoryPromoVariant_new");
ALTER TYPE "public"."CategoryPromoVariant" RENAME TO "CategoryPromoVariant_old";
ALTER TYPE "public"."CategoryPromoVariant_new" RENAME TO "CategoryPromoVariant";
DROP TYPE "public"."CategoryPromoVariant_old";
COMMIT;
