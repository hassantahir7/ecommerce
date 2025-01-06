import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      if (!createCategoryDto) {
        throw new HttpException(
          'No category data provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createCategory = await this.prismaService.categories.create({
        data: { ...createCategoryDto },
      });

      return {
        success: true,
        message: 'Category created successfully',
        data: createCategory,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve all categories
  async findAll() {
    try {
      const categories = await this.prismaService.categories.findMany({
        where: { is_Active: true, is_Deleted: false },
      });

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve categories: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve a single category by ID
  async findOne(id: string) {
    try {
      const category = await this.prismaService.categories.findUnique({
        where: { categoryId: id },
      });

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const existingCategory = await this.prismaService.categories.findUnique({
        where: { categoryId: id },
      });

      if (!existingCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      const updatedCategory = await this.prismaService.categories.update({
        where: { categoryId: id },
        data: { ...updateCategoryDto },
      });

      return {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Soft delete a category
  async remove(id: string) {
    try {
      const existingCategory = await this.prismaService.categories.findUnique({
        where: { categoryId: id },
      });

      if (!existingCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      const deletedCategory = await this.prismaService.categories.update({
        where: { categoryId: id },
        data: { is_Deleted: true },
      });

      return {
        success: true,
        message: 'Category removed successfully',
        data: deletedCategory,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to remove category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
