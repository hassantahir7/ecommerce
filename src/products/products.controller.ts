import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Retrieve all products' })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(ProductsEndpoints.findOne)
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
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
