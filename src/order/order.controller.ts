import { Controller, Post, Body, UseGuards, Get, Param, Req } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderEndpoints } from 'src/common/endpoints/order.endpoint';

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
  async getOrders(@Req() req) {
    return this.orderService.getOrderByUserId(req.user.userId);
  }

  @UseGuards(JwtGuard)
  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details by order ID' })
  @ApiBearerAuth()
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }
}
