import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartEndpoints } from 'src/common/endpoints/cart.endpoint';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Create a new cart
  @UseGuards(JwtGuard)
  @Post(CartEndpoints.create)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Create a new cart for a user' })
  async create(@Req() req) {
    return this.cartService.create(req.user.id);
  }

  // Get cart by userId
  @UseGuards(JwtGuard)
  @Get(CartEndpoints.findOne)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the cart for a specific user' })
  async findByUserId(@Req() req) {
    return this.cartService.findByUserId(req.user.userId);
  }

  // Delete a cart (soft delete by setting is_Deleted to true)
  @Delete(CartEndpoints.remove)
  @ApiOperation({ summary: 'Delete (soft delete) a cart by cartId' })
  async delete(@Param('cartId') cartId: string) {
    return this.cartService.delete(cartId);
  }
}
