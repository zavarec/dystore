-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "motifId" TEXT;

-- CreateIndex
CREATE INDEX "Product_motifId_idx" ON "public"."Product"("motifId");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_motifId_fkey" FOREIGN KEY ("motifId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
