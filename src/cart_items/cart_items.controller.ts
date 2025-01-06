import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartItemsEndpoints } from 'src/common/endpoints/cart-items.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('Cart Items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  // Create a cart item
  @UseGuards(JwtGuard)
  @Post(CartItemsEndpoints.create)
  @ApiOperation({ summary: 'Create a new cart item' })
  @ApiBearerAuth() 
  async create(@Body() createCartItemDto: CreateCartItemDto, @Req() req) {
    return this.cartItemsService.create(createCartItemDto, req.user.userId);
  }

  // Get all cart items
  @Get(CartItemsEndpoints.findAll)
  @ApiOperation({ summary: 'Retrieve all cart items' })
  async findAll() {
    return this.cartItemsService.findAll();
  }

  // Get a specific cart item by ID
  @Get(CartItemsEndpoints.findOne)
  @ApiOperation({ summary: 'Retrieve a cart item by ID' })
  async findOne(@Param('id') id: string) {
    return this.cartItemsService.findOne(id);
  }

  // Update a cart item
  @Patch(CartItemsEndpoints.update)
  @ApiOperation({ summary: 'Update an existing cart item' })
  async update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.update(id, updateCartItemDto);
  }

  // Soft delete a cart item
  @Delete(CartItemsEndpoints.remove)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a cart item' })
  async remove(@Param('id') id: string) {
    return this.cartItemsService.remove(id);
  }
}
