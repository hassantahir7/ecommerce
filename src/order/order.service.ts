import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddressType, OrderStatus, PaymentMethod } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { OrderInquiriesDto } from './dto/order-inquiries.dto';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class OrderService {
  constructor(
    private mailerService: MailerService,
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.cartService.findByUserId(userId);
    const checkExistingAddress = await this.prismaService.address.findFirst({
      where: {
        userId,
        type: AddressType.PRIMARY,
      },
    });
    let address;
    if (checkExistingAddress) {
      address = await this.prismaService.address.update({
        where: {
          addressId: checkExistingAddress.addressId,
        },
        data: {
          address: createOrderDto.address,
          city: createOrderDto.city,
          area: createOrderDto.area,
          apartment: createOrderDto.apartment,
          contactNumber: createOrderDto.contactNumber,
          firstName: createOrderDto.firstName,
          lastName: createOrderDto.lastName,
        },
      });
    } else {
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
          type: AddressType.PRIMARY,
        },
      });
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
        orderItems: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (createOrderDto.paymentMethod === PaymentMethod.CASH) {
      await this.prismaService.cart.delete({
        where: { userId },
      });

      const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p style="color: #555;">Dear <strong>${createOrderDto.firstName}</strong>,</p>
        <p style="color: #555;">Thank you for your order! Here are your order details:</p>
    
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Product</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Unit Price</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) =>
                  `<tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.variant.product.name}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</td>
                  </tr>`,
              )
              .join('')}
          </tbody>
        </table>
    
        <p style="text-align: right; font-size: 18px; margin-top: 20px;">
          <strong>Subtotal:</strong> $${subtotal.toFixed(2)}
        </p>
        <p style="text-align: right; font-size: 18px;">
          <strong>Discount:</strong> -$${createOrderDto.discount.toFixed(2)}
        </p>
        <p style="text-align: right; font-size: 20px; font-weight: bold; color: #d9534f;">
          Total: $${total.toFixed(2)}
        </p>
    
        <p style="margin-top: 20px;">We will notify you once your order is on the way.</p>
        <p style="color: #555;">Best regards,<br><strong>Arabica Latina</strong></p>
      </div>
    `;

      await this.mailerService.sendEmailForOrderConfirmation(
        order.user.email,
        'Order Confirmation',
        emailBody,
      );
    }

    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  async confirmOrder(orderId: string, userId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (order.status === OrderStatus.CONFIRMED) {
      throw new HttpException(
        'Order already confirmed',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const updatedOrder = await this.prismaService.order.update({
        where: { orderId },
        data: {
          status: 'CONFIRMED',
        },
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
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      await this.prismaService.cart.delete({
        where: { userId },
      });

      const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p style="color: #555;">Dear <strong>${updatedOrder.user.name}</strong>,</p>
        <p style="color: #555;">Thank you for your order! Here are your order details:</p>
    
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Product</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Unit Price</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${updatedOrder.orderItems
              .map(
                (item) =>
                  `<tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.variant.product.name}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</td>
                  </tr>`,
              )
              .join('')}
          </tbody>
        </table>
    
        <p style="text-align: right; font-size: 18px; margin-top: 20px;">
          <strong>Subtotal:</strong> $${updatedOrder.subtotal.toFixed(2)}
        </p>
        <p style="text-align: right; font-size: 18px;">
          <strong>Discount:</strong> -$${updatedOrder.discount.toFixed(2)}
        </p>
        <p style="text-align: right; font-size: 20px; font-weight: bold; color: #d9534f;">
          Total: $${updatedOrder.total.toFixed(2)}
        </p>
    
        <p style="margin-top: 20px;">We will notify you once your order is on the way.</p>
        <p style="color: #555;">Best regards,<br><strong>Arabica Latina</strong></p>
      </div>
    `;

      await this.mailerService.sendEmailForOrderConfirmation(
        updatedOrder.user.email,
        'Order Confirmation',
        emailBody,
      );

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

  async getOrderByUserId(userId: string, filter?: string) {
    let whereCondition: any = { userId };

    if (filter === 'last_six_months') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      whereCondition.createdAt = { gte: sixMonthsAgo };
    } else if (filter === 'last_year') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      whereCondition.createdAt = { gte: oneYearAgo };
    }

    const userOrders = await this.prismaService.order.findMany({
      where: whereCondition,
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
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      message: 'Orders fetched successfully',
      data: userOrders,
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
        address: true,
      },
    });

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    const { orderId, status } = updateOrderStatusDto;

    if (!orderId || !status) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    let data;
    if (status === OrderStatus.PACKED) {
      data = {
        status,
        packedTime: new Date(),
      };
    } else if (status === OrderStatus.DISPATCHED) {
      data = {
        status,
        sentTime: new Date(),
      };
    } else {
      data = {
        status,
      };
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
        data: data,
      });

      return {
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
      };
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

  async orderInquiries(orderInquiriesDto: OrderInquiriesDto, userId: string) {
    const { orderId, options, description } = orderInquiriesDto;

    if (!orderId || !options) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = await this.prismaService.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    try {
      const inquiry = await this.prismaService.orderInquiries.create({
        data: {
          orderId,
          options,
          description,
          userId,
        },
      });

      return {
        success: true,
        message: 'Order inquiry submitted successfully',
        data: inquiry,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to submit order inquiry: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderInquiries() {
    try {
      const inquiry = await this.prismaService.orderInquiries.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          order: {
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
        orderBy: {
          is_Active: 'desc'
        }
      });

      return {
        success: true,
        message: 'Order inquiries fetched successfully',
        data: inquiry,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get order inquiries: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createInquiry(
    createResponseDto: CreateResponseDto
  ) {
    const {subject, email, message, orderInquiriesId} = createResponseDto
    const emailBody = await this.generateEmailTemplate(subject, message);

    await this.mailerService.sendEmailForInquiries(
      email,
      'Inquiry Received',
      emailBody,
    );
    const data = await this.prismaService.orderInquiries.update({
      where: {
        orderInquiriesId,
      },
      data: {
        is_Active: false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order: {
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
      data: data,
      message: 'Sent Successfully',
    };
  }

  generateEmailTemplate(subject: string, message: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border: 1px solid #ddd;">
        <table style="width: 100%; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="background-color: #FBC02D; padding: 15px; text-align: center; color: #ffffff; font-size: 20px; font-weight: bold; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              Inquiry Received
            </td>
          </tr>
  
          <!-- Body -->
          <tr>
            <td style="padding: 20px; color: #333;">
              <p style="font-size: 16px; margin-bottom: 15px;">
                Thank you for reaching out to us. We have received your inquiry and will get back to you shortly.
              </p>
  
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 5px 0;"><strong>Response:</strong> ${message}</p>
              </div>
  
              <p style="font-size: 14px; color: #555;">
                Our support team will contact you as soon as possible.
              </p>
            </td>
          </tr>
  
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #555; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              Best Regards,<br>
              <strong>Arabic Latina Support Team</strong>
            </td>
          </tr>
        </table>
      </div>
    `;
  }
}
