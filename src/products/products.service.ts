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
        throw new HttpException(
          'No product data provided',
          HttpStatus.BAD_REQUEST,
        );
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
      throw new HttpException(
        'No category ID provided',
        HttpStatus.BAD_REQUEST,
      );
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

  async findAll(filters?: {
    type?: string;
    categoryName?: string;
    color?: string;
    style?: string
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const colorsArray = filters?.color ? filters.color.split(',') : [];

      const products = await this.prismaService.product.findMany({
        where: {
          is_Active: true,
          is_Deleted: false,
          ...(filters?.type && {
            category: {
              gender: filters.type.toUpperCase(),
            },
          }),
          ...(filters?.categoryName && {
            category: {
              name: { contains: filters.categoryName, mode: 'insensitive' },
            },
          }),

          ...(filters?.style && {
            Variants: {
              some: {
                style: { contains: filters.style, mode: 'insensitive' },
              }
            },
          }),
          ...(colorsArray.length > 0 && {
            Variants: {
              some: {
                color: {
                  in: colorsArray,
                  mode: 'insensitive',
                },
              },
            },
          }),
        },
        include: {
          Variants: true,
          category: true,
        },
        orderBy: [
          {
            basePrice: filters?.sortOrder || 'asc',
          },
        ],
      });

      const processedProducts = products.map((product) => {
        let colorsAvailable = product.Variants.map((variant) => variant.color);

        let uniqueColors: string[] = [];

        colorsAvailable.forEach((color) => {
          if (color.includes('&')) {
            const duotoneColors = color.split('&').map((col) => col.trim());
            duotoneColors.forEach((duoColor) => {
              if (!uniqueColors.includes(duoColor)) {
                uniqueColors.push(duoColor);
              }
            });
          } else {
            if (!uniqueColors.includes(color)) {
              uniqueColors.push(color); // Add only if not already added
            }
          }
        });

        const totalColors = uniqueColors.length;

        return {
          ...product,
          colorsAvailable: uniqueColors,
          totalColors,
        };
      });

      return {
        success: true,
        message: 'Products retrieved successfully',
        data: processedProducts,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findColorsByCategory(data?: { categoryName: string }) {
    try {
      const { categoryName } = data;

      const duotoneVariants = await this.prismaService.productVariant.findMany({
        where: {
          product: {
            is_Active: true,
            is_Deleted: false,
            category: {
              name: { contains: categoryName, mode: 'insensitive' },
            },
          },
          isDuotone: true,
        },
        select: { color: true },
      });

      const colorVariants = await this.prismaService.productVariant.findMany({
        where: {
          product: {
            is_Active: true,
            is_Deleted: false,
            category: {
              name: { contains: categoryName, mode: 'insensitive' },
            },
          },
          isDuotone: false,
        },
        select: { color: true },
      });

      const style = await this.prismaService.productVariant.findMany({
        where: {
          product: {
            is_Active: true,
            is_Deleted: false,
            category: {
              name: { contains: categoryName, mode: 'insensitive' },
            },
          },
        },
        select: { style: true },
      });

      const duotoneColors = duotoneVariants
        .map((variant) => variant.color)
        .filter((color): color is string => !!color);
      const regularColors = colorVariants
        .map((variant) => variant.color)
        .filter((color): color is string => !!color);

        const regularStyles = style
        .map((index) => index.style)
        .filter((style): style is string => !!style);

      return {
        success: true,
        message: 'Colors retrieved successfully for the category',
        data: {
          categoryName,
          colors: {
            duotone: duotoneColors,
            regular: regularColors,
          },
          style: regularStyles,
          totalColors: {
            duotone: duotoneColors.length,
            regular: regularColors.length,
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve colors: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLimitedEditionProducts() {
    try {
      const products = await this.prismaService.product.findMany({
        where: { limitedAddition: true, is_Active: true, is_Deleted: false },
        include: { Variants: true },
      });

      if (!products) {
        throw new HttpException(
          'No limited edition products found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Limited edition products retrieved successfully',
        data: products,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to retrieve limited edition products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchProducts(query) {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
          is_Active: true,
          is_Deleted: false,
        },
        include: {
          Variants: true,
        },
      });

      return {
        success: true,
        message: 'Search results retrieved successfully',
        data: {
          products,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve search results: ${error.message}`,
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
