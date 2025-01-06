-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE CASCADE ON UPDATE CASCADE;
