import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductVariantsDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantsDto } from './dto/update-product_variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductVariantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductVariantDto: CreateProductVariantsDto) {
    try {
      if (!createProductVariantDto) {
        throw new HttpException('No product variant data provided', HttpStatus.BAD_REQUEST);
      }

      const createVariant = await this.prismaService.productVariant.create({
        data: { ...createProductVariantDto },
      });

      return {
        success: true,
        message: 'Product variant created successfully',
        data: createVariant,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create product variant: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const variants = await this.prismaService.productVariant.findMany({
        where: { is_Active: true, is_Deleted: false },
      });

      return {
        success: true,
        message: 'Product variants retrieved successfully',
        data: variants,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve product variants: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const variant = await this.prismaService.productVariant.findUnique({
        where: { variantId: id },
      });

      if (!variant) {
        throw new HttpException('Product variant not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Product variant retrieved successfully',
        data: variant,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve product variant: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateProductVariantDto: UpdateProductVariantsDto) {
    try {
      const existingVariant = await this.prismaService.productVariant.findUnique({
        where: { variantId: id },
      });

      if (!existingVariant) {
        throw new HttpException('Product variant not found', HttpStatus.NOT_FOUND);
      }

      const updatedVariant = await this.prismaService.productVariant.update({
        where: { variantId: id },
        data: { ...updateProductVariantDto },
      });

      return {
        success: true,
        message: 'Product variant updated successfully',
        data: updatedVariant,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update product variant: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const existingVariant = await this.prismaService.productVariant.findUnique({
        where: { variantId: id },
      });

      if (!existingVariant) {
        throw new HttpException('Product variant not found', HttpStatus.NOT_FOUND);
      }

      const deletedVariant = await this.prismaService.productVariant.update({
        where: { variantId: id },
        data: { is_Deleted: true },
      });

      return {
        success: true,
        message: 'Product variant removed successfully',
        data: deletedVariant,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to remove product variant: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
