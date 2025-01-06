import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductVariantsService } from './product_variants.service';
import { CreateProductVariantsDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantsDto } from './dto/update-product_variant.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductVariantsEndpoints } from 'src/common/endpoints/product-variants.endpoint';

@ApiTags('Product Variant')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly productVariantService: ProductVariantsService) {}

  @Post(ProductVariantsEndpoints.create)
  @ApiOperation({ summary: 'Create a new product variant' })
  async create(@Body() createProductVariantDto: CreateProductVariantsDto) {
    return this.productVariantService.create(createProductVariantDto);
  }

  @Get(ProductVariantsEndpoints.findAll)
  @ApiOperation({ summary: 'Retrieve all product variants' })
  async findAll() {
    return this.productVariantService.findAll();
  }

  @Get(ProductVariantsEndpoints.findOne)
  @ApiOperation({ summary: 'Retrieve a product variant by ID' })
  async findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  @Patch(ProductVariantsEndpoints.update)
  @ApiOperation({ summary: 'Update a product variant' })
  async update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantsDto) {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete(ProductVariantsEndpoints.remove)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a product variant' })
  async remove(@Param('id') id: string) {
    return this.productVariantService.remove(id);
  }
}
