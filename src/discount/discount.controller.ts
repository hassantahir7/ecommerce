import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FindDiscountDto } from './dto/find-discount.dto';
import { DiscountEndpoints } from 'src/common/endpoints/discount.endpoint';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post(DiscountEndpoints.create)
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiResponse({ status: 201, description: 'Discount created successfully' })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get(DiscountEndpoints.findAll)
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({ status: 200, description: 'Returns all discounts' })
  findAll() {
    return this.discountService.findAll();
  }

  @Post(DiscountEndpoints.findDiscountByPromoCode)
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({ status: 200, description: 'Returns all discounts' })
  findDiscountByPromoCode(@Body() findDiscountDto: FindDiscountDto) {
    return this.discountService.findDiscountByPromoCode(findDiscountDto);
  }

  @Get(DiscountEndpoints.findOne)
  @ApiOperation({ summary: 'Get a discount by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Discount ID' })
  @ApiResponse({ status: 200, description: 'Returns a discount' })
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Patch(DiscountEndpoints.update)
  @ApiOperation({ summary: 'Update a discount by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Discount ID' })
  @ApiResponse({ status: 200, description: 'Discount updated successfully' })
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(DiscountEndpoints.remove)
  @ApiOperation({ summary: 'Delete a discount by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Discount ID' })
  @ApiResponse({ status: 200, description: 'Discount deleted successfully' })
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
