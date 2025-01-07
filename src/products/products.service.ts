import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      if (!createProductDto) {
        throw new HttpException('No product data provided', HttpStatus.BAD_REQUEST);
      }

      const createProduct = await this.prismaService.product.create({
        data: { ...createProductDto },
      });

      return {
        success: true,
        message: 'Product created successfully',
        data: createProduct,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductsByCategory(categoryId: string) {
    if (!categoryId) {
      throw new HttpException('No category ID provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const products = await this.prismaService.product.findMany({
        where: { categoryId, is_Active: true, is_Deleted: false },
      });

      return {
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve products by category ID: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const products = await this.prismaService.product.findMany({
        where: { is_Active: true, is_Deleted: false },
      });

      return {
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { productId: id },
      });

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { productId: id },
      });

      if (!existingProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const updatedProduct = await this.prismaService.product.update({
        where: { productId: id },
        data: { ...updateProductDto },
      });

      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { productId: id },
      });

      if (!existingProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const deletedProduct = await this.prismaService.product.update({
        where: { productId: id },
        data: { is_Deleted: true },
      });

      return {
        success: true,
        message: 'Product removed successfully',
        data: deletedProduct,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to remove product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
