import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CartItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new cart item
  async create(createCartItemDto: CreateCartItemDto, userId) {
    const { variantId, quantity } = createCartItemDto;
  
    try {
      let existingCart = await this.prismaService.cart.findUnique({
        where: { userId: userId },
      });
  
      // If no cart exists, create a new cart for the user
      if (!existingCart) {
        existingCart = await this.prismaService.cart.create({
          data: {
            userId: userId, // Assuming you have userId in the DTO
          },
        });
      }
  
      // Create a cart item for the existing or newly created cart
      const cartItem = await this.prismaService.cartItem.create({
        data: {
          cartId: existingCart.cartId, // Use the existing or new cart's ID
          variantId,
          quantity,
        },
      });
  
      return {
        success: true,
        message: 'Cart item created successfully',
        data: cartItem,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create cart item: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  // Retrieve all cart items
  async findAll() {
    try {
      const cartItems = await this.prismaService.cartItem.findMany({
        where: { is_Active: true, is_Deleted: false },
      });

      return {
        success: true,
        message: 'Cart items retrieved successfully',
        data: cartItems,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve cart items: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve a single cart item by ID
  async findOne(id: string) {
    try {
      const cartItem = await this.prismaService.cartItem.findUnique({
        where: { cartItemId: id },
      });

      if (!cartItem) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Cart item retrieved successfully',
        data: cartItem,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve cart item: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a cart item
  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    try {
      const existingCartItem = await this.prismaService.cartItem.findUnique({
        where: { cartItemId: id },
      });

      if (!existingCartItem) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }

      const updatedCartItem = await this.prismaService.cartItem.update({
        where: { cartItemId: id },
        data: { ...updateCartItemDto },
      });

      return {
        success: true,
        message: 'Cart item updated successfully',
        data: updatedCartItem,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update cart item: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Soft delete a cart item
  async remove(id: string) {
    try {
      const existingCartItem = await this.prismaService.cartItem.findUnique({
        where: { cartItemId: id },
      });

      if (!existingCartItem) {
        throw new HttpException('Cart item not found', HttpStatus.NOT_FOUND);
      }

      const deletedCartItem = await this.prismaService.cartItem.update({
        where: { cartItemId: id },
        data: { is_Deleted: true },
      });

      return {
        success: true,
        message: 'Cart item removed successfully',
        data: deletedCartItem,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to remove cart item: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
