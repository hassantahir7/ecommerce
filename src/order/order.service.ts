import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddressType, OrderStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.cartService.findByUserId(userId);
    const checkExistingAddress = await this.prismaService.address.findFirst({
      where: {
        userId,
        type: AddressType.PRIMARY
      }
    })
    let address;
    if(checkExistingAddress){
   
      address = await this.prismaService.address.update({
        where:{
          addressId: checkExistingAddress.addressId
        },
        data: {
          address: createOrderDto.address,
          city: createOrderDto.city,
          area: createOrderDto.area,
          apartment: createOrderDto.apartment,
          contactNumber: createOrderDto.contactNumber,
          firstName: createOrderDto.firstName,
          lastName: createOrderDto.lastName
        }
      })
    }else{
      address = await this.prismaService.address.create({
        data: {
          userId,
          address: createOrderDto.address,
          city: createOrderDto.city,
          area: createOrderDto.area,
          apartment: createOrderDto.apartment,
          contactNumber: createOrderDto.contactNumber,
          firstName: createOrderDto.firstName,
          lastName: createOrderDto.lastName,
          type: AddressType.PRIMARY
        }
      })
    }
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
        addressId: address.addressId,
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

    if(createOrderDto.paymentMethod === PaymentMethod.CASH){
      await this.prismaService.cart.delete({
        where: { userId },
      });
    }
    
    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  async confirmOrder(userId: string, orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (order.status === OrderStatus.CONFIRMED) {
      throw new HttpException('Order already confirmed', HttpStatus.BAD_REQUEST);
    }

    try {
      const updatedOrder = await this.prismaService.order.update({
        where: { orderId },
        data: {
          status: 'CONFIRMED',
        },
      });

      await this.prismaService.cart.delete({
        where: { userId },
      });

      return {
        success: true,
        message: 'Order confirmed successfully',
        data: updatedOrder,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to confirm order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
        address: true
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
            address: true,
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
        address: true
      },
    });

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto){
    const { orderId, status } = updateOrderStatusDto;

    if (!orderId || !status) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }

    const order = await this.prismaService.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    try {
     const updatedOrder = await this.prismaService.order.update({
        where: { orderId },
        data: { status },
      });

      return {
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
      }
    } catch (error) {
      throw new HttpException(
        `Failed to update order status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
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
