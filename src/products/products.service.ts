import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteProductDto } from './dto/add-to-favorite.dto';

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

  async addOrRemoveFromFavorite(
    favoriteProductDto: FavoriteProductDto,
    userId: string,
  ) {
    try {
      if (!favoriteProductDto) {
        throw new HttpException(
          'No product data provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingFavorite = await this.prismaService.wishlist.findFirst({
        where: {
          userId,
          productId: favoriteProductDto.productId,
        },
      });

      if (existingFavorite) {
        await this.prismaService.wishlist.delete({
          where: { wishlistId: existingFavorite.wishlistId },
        });

        const wishlist = await this.prismaService.wishlist.findMany({
          where: {
            userId,
          },
        });

        return {
          success: true,
          message: 'Product removed from wishlist successfully!',
          data: { wishlist, countFavorite: wishlist.length },
        };
      }

      const createProduct = await this.prismaService.wishlist.create({
        data: { ...favoriteProductDto, userId },
      });

      const countFavorite = await this.prismaService.wishlist.findMany({
        where: {
          userId,
        },
      });

      return {
        success: true,
        message: 'Product added to wishlist successfully!',
        data: { createProduct, countFavorite: countFavorite.length },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update wishlist: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserFavoriteItems(userId: string) {
    if (!userId) {
      throw new HttpException('No user ID provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const wishlist = await this.prismaService.wishlist.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              Variants: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'User favorite items retrieved successfully',
        data: { wishlist: wishlist, countFavorite: wishlist.length },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve user favorite items: ${error.message}`,
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

  async findAll(
    userId?: string,
    filters?: {
      type?: string;
      categoryName?: string;
      color?: string;
      style?: string;
      sortOrder?: 'asc' | 'desc' | 'newest' | 'oldest';
    },
  ) {
    try {
      const colorsArray = filters?.color ? filters.color.split(',') : [];

      const whereConditions: any[] = [
        { is_Active: true, is_Deleted: false },
        filters?.type && { category: { gender: filters.type.toUpperCase() } },
        filters?.categoryName && {
          category: {
            name: { contains: filters.categoryName, mode: 'insensitive' },
          },
        },
        filters?.style && {
          Variants: {
            some: { style: { contains: filters.style, mode: 'insensitive' } },
          },
        },
        colorsArray.length > 0 && {
          Variants: {
            some: { color: { in: colorsArray, mode: 'insensitive' } },
          },
        },
      ].filter(Boolean);

      const orderBy =
        filters?.sortOrder === 'newest'
          ? { createdAt: 'desc' as const }
          : filters?.sortOrder === 'oldest'
            ? { createdAt: 'asc' as const }
            : filters?.sortOrder === 'asc'
              ? { basePrice: 'asc' as const }
              : filters?.sortOrder === 'desc'
                ? { basePrice: 'desc' as const }
                : { basePrice: 'asc' as const };
      const products = await this.prismaService.product.findMany({
        where: {
          AND: [
            ...whereConditions,
            {
              Variants: {
                some: {},
              },
            },
          ],
        },
        include: {
          Variants: true,
          category: true,
        },
        orderBy: orderBy,
      });

      let wishlistProductIds = new Set<string>();
      if (userId) {
        const wishlist = await this.prismaService.wishlist.findMany({
          where: { userId },
          select: { productId: true },
        });
        wishlistProductIds = new Set(wishlist.map((item) => item.productId));
      }

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
              uniqueColors.push(color);
            }
          }
        });

        const totalColors = uniqueColors.length;
        const isInWishlist = userId
          ? wishlistProductIds.has(product.productId)
          : undefined;

        return {
          ...product,
          colorsAvailable: uniqueColors,
          totalColors,
          ...(userId && { isInWishlist }),
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

      const limitedEditionRegularColors =
        await this.prismaService.productVariant.findMany({
          where: {
            product: {
              is_Active: true,
              is_Deleted: false,
              limitedAddition: true,
            },
            isDuotone: false,
          },
          select: { color: true },
        });

      const limitedEditionDuotoneColors =
        await this.prismaService.productVariant.findMany({
          where: {
            product: {
              is_Active: true,
              is_Deleted: false,
              limitedAddition: true,
            },
            isDuotone: true,
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

      const LEDuotoneColors = limitedEditionDuotoneColors
        .map((index) => index.color)
        .filter((color): color is string => !!color);

      const LERegularColors = limitedEditionRegularColors
        .map((index) => index.color)
        .filter((color): color is string => !!color);

      const regularStyles = style
        .map((index) => index.style)
        .filter((style): style is string => !!style);

      return {
        success: true,
        message: 'Colors retrieved successfully for the category',
        data: {
          categoryName: categoryName || 'Limited Edition',
          colors: {
            duotone: duotoneColors,
            regular: regularColors,
            limitedEditionRegularColors: LERegularColors,
            limitedEditionDuotoneColors: LEDuotoneColors,
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

  async getLimitedEditionProducts(filters?: {
    type?: string;
    color?: string;
    style?: string;
    sortOrder?: 'asc' | 'desc' | 'newest' | 'oldest';
  }) {
    try {
      const colorsArray = filters?.color ? filters.color.split(',') : [];

      const whereConditions: any[] = [
        { limitedAddition: true, is_Active: true, is_Deleted: false },
        filters?.type && {
          category: { gender: filters.type.toUpperCase() },
        },
        filters?.style && {
          Variants: {
            some: { style: { contains: filters.style, mode: 'insensitive' } },
          },
        },
        colorsArray.length > 0 && {
          Variants: {
            some: { color: { in: colorsArray, mode: 'insensitive' } },
          },
        },
      ];

      const validWhereConditions = whereConditions.filter(Boolean);

      const orderBy =
        filters?.sortOrder === 'newest'
          ? { createdAt: 'desc' as const }
          : filters?.sortOrder === 'oldest'
            ? { createdAt: 'asc' as const }
            : filters?.sortOrder === 'asc'
              ? { basePrice: 'asc' as const }
              : filters?.sortOrder === 'desc'
                ? { basePrice: 'desc' as const }
                : { basePrice: 'asc' as const };

      const products = await this.prismaService.product.findMany({
        where: {
          AND: [
            ...validWhereConditions,
            {
              Variants: {
                some: {},
              },
            },
          ],
        },
        include: {
          Variants: true,
          category: true,
        },
        orderBy: orderBy,
      });

      if (products.length === 0) {
        throw new HttpException(
          'No limited edition products found',
          HttpStatus.NOT_FOUND,
        );
      }

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
              uniqueColors.push(color);
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
        message: 'Limited edition products retrieved successfully',
        data: processedProducts,
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
          Variants: {
            some: {},
          },
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

      const deletedProduct = await this.prismaService.product.delete({
        where: { productId: id },
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
