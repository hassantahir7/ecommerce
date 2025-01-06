-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "is_Active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_Deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "is_Active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_Deleted" BOOLEAN NOT NULL DEFAULT false;
