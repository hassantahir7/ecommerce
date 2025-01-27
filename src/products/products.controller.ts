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
  Query,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsEndpoints } from 'src/common/endpoints/products.endpoint';
import { FavoriteProductDto } from './dto/add-to-favorite.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(ProductsEndpoints.create)
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  

  @Post(ProductsEndpoints.addToFavorite)
  @ApiOperation({ summary: 'Add product to favorites' })
  async addToFavorite(@Body() favoriteProductDto: FavoriteProductDto, @Req() req) {
    return this.productsService.addToFavorite(favoriteProductDto, req.user.userId || req.user.id);
  }

  @Post(ProductsEndpoints.getUserFavoriteItems)
  @ApiOperation({ summary: 'Get favorite products!' })
  async getUserFavoriteItems(@Req() req) {
    return this.productsService.getUserFavoriteItems(req.user.userId || req.user.id);
  }

  @Get(ProductsEndpoints.findAll)
  @ApiOperation({
    summary:
      'Retrieve all products with optional filters (type, category, color)',
    description:
      'Retrieve products filtered by type, category name, or color. All filters are optional.',
  })
  async findAll(
    @Query('type') type?: string,
    @Query('categoryName') categoryName?: string,
    @Query('color') color?: string,
    @Query('style') style?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.productsService.findAll({
      type,
      categoryName,
      color,
      style,
      sortOrder,
    });
  }

  @Get(ProductsEndpoints.findColorsByCategory)
  @ApiOperation({
    summary: 'Retrieve all colors of products',
    description: 'Retrieve colors of products for filter.',
  })
  async findColorsByCategory(@Query('categoryName') categoryName?: string, ) {
    return this.productsService.findColorsByCategory({categoryName,});
  }

  @Get(ProductsEndpoints.searchProducts)
  @ApiOperation({
    summary: 'Retrieve all colors of products',
    description: 'Retrieve colors of products for filter.',
  })
  @Get(ProductsEndpoints.searchProducts)
  async searchProducts(@Query('query') query: string) {
    return this.productsService.searchProducts(query);
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
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(ProductsEndpoints.remove)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a product' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
