/*
  Warnings:

  - You are about to drop the column `style` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "style";

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "style" TEXT;
