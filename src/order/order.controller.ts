import { Controller, Post, Body, UseGuards, Get, Param, Req, Query } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderEndpoints } from 'src/common/endpoints/order.endpoint';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderInquiriesDto } from './dto/order-inquiries.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create an order from cart items' })
  @ApiBearerAuth()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.orderService.createOrder(createOrderDto, req.user.userId);
  }

  @UseGuards(JwtGuard)
  @Get(OrderEndpoints.findUserAllOrders)
  @ApiOperation({ summary: 'Get all orders for a user' })
  @ApiBearerAuth()
  async getOrders(@Req() req, @Query('filter') filter?: string) {
    return this.orderService.getOrderByUserId(req.user.userId, filter);
  }
  

  @UseGuards(JwtGuard)
  @Post(OrderEndpoints.confirmOrder)
  @ApiOperation({ summary: 'Confirm Order Status' })
  @ApiBearerAuth()
  async confirmOrder(@Req() req, @Body('orderId') orderId: string) {
    return this.orderService.confirmOrder(orderId, req.user.id || req.user.userId);
  }

  @Post(OrderEndpoints.updateOrderStatus)
  @ApiOperation({ summary: 'Change Order Status' })
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(updateOrderStatusDto);
  }


  @UseGuards(JwtGuard)
  @Post(OrderEndpoints.createInquiry)
  @ApiOperation({ summary: 'Create order Inquiry' })
  @ApiBearerAuth()
  async orderInquiries(@Req() req, @Body() orderInquiriesDto: OrderInquiriesDto) {
    return this.orderService.orderInquiries(orderInquiriesDto, req.user.id || req.user.userId);
  }


  @Get(OrderEndpoints.getAllOrders)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiBearerAuth()
  async getAllOrders(@Req() req) {
    return this.orderService.getAllOrders();
  }

  @Get(OrderEndpoints.getAllCustomersWithOrders)
  @ApiOperation({ summary: 'Get all customers with orders!' })
  @ApiBearerAuth()
  async getAllCustomersWithOrders(@Req() req) {
    return this.orderService.getAllCustomersWithOrders();
  }


  @UseGuards(JwtGuard)
  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details by order ID' })
  @ApiBearerAuth()
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }
}
