import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesEndpoints } from 'src/common/endpoints/categories.endpoint';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a category
  @Post(CategoriesEndpoints.create)
  @ApiOperation({ summary: 'Create a new category' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Get all categories
  @Get(CategoriesEndpoints.findAll)
  @ApiOperation({ summary: 'Retrieve all categories' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  // Get a specific category by ID
  @Get(CategoriesEndpoints.findOne)
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // Update a category
  @Patch(CategoriesEndpoints.update)
  @ApiOperation({ summary: 'Update an existing category' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Soft delete a category
  @Delete(CategoriesEndpoints.remove)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a category' })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}


