-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."OrderStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "public"."OrderStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "public"."OrderStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."carts" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "public"."Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "public"."Category"("parentId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "public"."Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "public"."Product"("isFeatured");

-- CreateIndex
CREATE INDEX "Product_popularity_idx" ON "public"."Product"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "public"."cart_items"("cartId", "productId");

-- CreateIndex
CREATE INDEX "carts_userId_idx" ON "public"."carts"("userId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "public"."orders"("userId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "public"."orders"("status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "public"."users"("phone");

-- Generated via prisma migrate diff
