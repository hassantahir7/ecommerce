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
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsEndpoints } from 'src/common/endpoints/products.endpoint';
import { FavoriteProductDto } from './dto/add-to-favorite.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(ProductsEndpoints.create)
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtGuard)
  @Post(ProductsEndpoints.addToFavorite)
  @ApiOperation({ summary: 'Add product to favorites' })
  async addToFavorite(
    @Body() favoriteProductDto: FavoriteProductDto,
    @Req() req,
  ) {
    return this.productsService.addOrRemoveFromFavorite(
      favoriteProductDto,
      req.user.userId || req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Post(ProductsEndpoints.getUserFavoriteItems)
  @ApiOperation({ summary: 'Get favorite products!' })
  async getUserFavoriteItems(@Req() req) {
    return this.productsService.getUserFavoriteItems(
      req.user.userId || req.user.id,
    );
  }

  @Post(ProductsEndpoints.findAll)
  @ApiOperation({
    summary:
      'Retrieve all products with optional filters (type, category, color)',
    description:
      'Retrieve products filtered by type, category name, or color. All filters are optional.',
  })
  async findAll(
    @Body('userId') userId,
    @Query('type') type?: string,
    @Query('categoryName') categoryName?: string,
    @Query('color') color?: string,
    @Query('duotone') duotone?: string,
    @Query('style') style?: string,
    @Query('query') query?: string,
    @Query('limitedEdition') limitedEdition?: boolean,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc' | 'newest' | 'oldest',
    
  ) {
    const filter = {
      type,
      categoryName,
      color,
      duotone,
      style,
      sortOrder,
      query,
      limitedEdition,
    }
    return this.productsService.getProducts(filter, userId);
  }

  @Get(ProductsEndpoints.findColorsByCategory)
  @ApiOperation({
    summary: 'Retrieve all colors of products',
    description: 'Retrieve colors of products for filter.',
  })
  async findColorsByCategory(@Query('categoryName') categoryName?: string) {
    return this.productsService.findColorsByCategory({ categoryName });
  }

  // @Get(ProductsEndpoints.searchProducts)
  // @ApiOperation({
  //   summary: 'Retrieve all colors of products',
  //   description: 'Retrieve colors of products for filter.',
  // })
  // @Post(ProductsEndpoints.searchProducts)
  // async searchProducts(@Query('query') query: string,
  // @Body('userId') userId,
  // @Query('type') type?: string,
  // @Query('color') color?: string,
  // @Query('style') style?: string,
  // @Query('duotone') duotone?: string,
  // @Query('sortOrder') sortOrder?: 'asc' | 'desc' | 'newest' | 'oldest',) {
  //   const filter = { type, color, duotone, style, sortOrder };
  //   return this.productsService.searchProducts(query, filter, userId);
  // }

  @Get(ProductsEndpoints.findOne)
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }


  // @Post(ProductsEndpoints.retrieveLimitedEditionProducts)
  // @ApiOperation({ summary: 'Retrieve Limited Edition Products' })
  // async getLimitedEditionProducts(
  //   @Body('userId') userId,
  //   @Query('type') type?: string,
  //   @Query('color') color?: string,
  //   @Query('style') style?: string,
  //   @Query('duotone') duotone?: string,
  //   @Query('sortOrder') sortOrder?: 'asc' | 'desc' | 'newest' | 'oldest',
  // ) {
  //   const filter = { type, color, duotone, style, sortOrder };
  //   return this.productsService.getLimitedEditionProducts(filter, userId);
  // }

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
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
