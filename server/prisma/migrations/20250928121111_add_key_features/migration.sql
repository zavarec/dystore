-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "marketingNote" TEXT;

-- CreateTable
CREATE TABLE "public"."product_key_features" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "footnote" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_key_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_key_features_productId_idx" ON "public"."product_key_features"("productId");

-- AddForeignKey
ALTER TABLE "public"."product_key_features" ADD CONSTRAINT "product_key_features_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
