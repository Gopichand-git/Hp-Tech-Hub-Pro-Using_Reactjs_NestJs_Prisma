-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "stock" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
