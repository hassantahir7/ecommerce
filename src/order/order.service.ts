import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.cartService.findByUserId(userId);

    if (!cart || !cart.data.CartItems || cart.data.CartItems.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    let total = 0;
    let subtotal = 0;
    let quantity = 0;

    const orderItems = [];

    for (const cartItem of cart.data.CartItems) {
      const { variant, quantity: itemQuantity } = cartItem;
      const price = variant.price;
      subtotal += price * itemQuantity;
      quantity += itemQuantity;

      orderItems.push({
        variantId: cartItem.variantId,
        quantity: itemQuantity,
        price,
      });

      // Deduct stock after adding to order
      await this.prismaService.productVariant.update({
        where: { variantId: cartItem.variantId },
        data: {
          stock: {
            decrement: itemQuantity,
          },
        },
      });
    }

    total = subtotal - createOrderDto.discount;

    const order = await this.prismaService.order.create({
      data: {
        userId,
        address: createOrderDto.address,
        contactNumber: createOrderDto.contactNumber,
        quantity: cart.data.CartItems.length,
        discount: createOrderDto.discount,
        total,
        subtotal,
        paymentMethod: createOrderDto.paymentMethod,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });

    await this.prismaService.cart.delete({
      where: { userId },
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  async getOrderByUserId(userId: string) {
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      include: {
        orderItems: {
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

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async getAllCustomersWithOrders() {
    const customers = await this.prismaService.user.findMany({
      where: {
        Order: {
          some: {}, 
        },
      },
      include: {
        Order: {
          include: {
            orderItems: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Customers with orders fetched successfully',
      data: customers,
    };
  }

  async getAllOrders() {
    const orders = await this.prismaService.order.findMany({
      include: {
        orderItems: {
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

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Order fetched successfully',
      data: order,
    };
  }
}
