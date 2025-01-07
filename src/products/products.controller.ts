import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, } from '@nestjs/swagger';
import { ProductsEndpoints } from 'src/common/endpoints/products.endpoint';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(ProductsEndpoints.create)
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(ProductsEndpoints.findAll)
@ApiOperation({
  summary: 'Retrieve all products with optional filters (type, category, color)',
  description: 'Retrieve products filtered by type, category name, or color. All filters are optional.',
})
async findAll(
  @Query('type') type?: string,
  @Query('categoryName') categoryName?: string,
  @Query('color') color?: string,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  return this.productsService.findAll({ type, categoryName, color, sortOrder });
}


  @Get(ProductsEndpoints.findOne)
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(ProductsEndpoints.retrieveLimitedEditionProducts)
  @ApiOperation({ summary: 'Retrieve Limited Edition Products' })
  async getLimitedEditionProducts() {
    return this.productsService.getLimitedEditionProducts();
  }

  @Patch(ProductsEndpoints.update)
  @ApiOperation({ summary: 'Update an existing product' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(ProductsEndpoints.remove)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a product' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
