-- CreateEnum
CREATE TYPE "public"."ContentSide" AS ENUM ('LEFT', 'RIGHT');

-- AlterTable
ALTER TABLE "public"."CategoryPromoSection" ADD COLUMN "contentSide" "public"."ContentSide";





