import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new cart
  async create(userId: string) {
    try {
      const cart = await this.prismaService.cart.create({
        data: {
          userId,
        },
      });

      return {
        success: true,
        message: 'Cart created successfully',
        data: cart,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create cart: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get cart by userId
  async findByUserId(userId: string) {
    try {
      const cart = await this.prismaService.cart.findFirst({
        where: { userId },
        include: {
          CartItems: {
            where: {
              is_Deleted: false,
            },
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
  
      if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
        throw new HttpException(
          'Cart not found for the user',
          HttpStatus.NOT_FOUND,
        );
      }

  
      const totalProductCount = cart.CartItems.length;
      const totalPrice = cart.CartItems?.reduce(
        (acc, item) => acc + (item?.quantity ?? 0) * (item?.variant?.price ?? 0),
        0,
      );
  
      return {
        success: true,
        message: 'Cart found',
        data: {
          ...cart,
          totalProductCount,
          totalPrice: totalPrice.toFixed(2),
        },
      };
    } catch (error) {
  
      throw new HttpException(
        `Failed to find cart: ${error.message}`,
        error.status,
      );
    }
  }
  

  // Delete a cart by setting is_Deleted to true
  async delete(cartId: string) {
    try {
      const cart = await this.prismaService.cart.update({
        where: { cartId },
        data: { is_Deleted: true },
      });

      return {
        success: true,
        message: 'Cart deleted successfully',
        data: cart,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete cart: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
