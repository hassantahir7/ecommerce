// discount.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { FindDiscountDto } from './dto/find-discount.dto';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  generatePromoCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  }

  async create(data: CreateDiscountDto) {
    const promoCode = await this.generatePromoCode();
    return this.prisma.discount.create({
      data: { ...data, promoCode },
    });
  }

  async findAll() {
    console.log("here")
    return this.prisma.discount.findMany({ where: { is_Deleted: false } });
  }

  async findOne(id: string) {
    return this.prisma.discount.findUnique({ where: { discountId: id } });
  }

  async findDiscountByPromoCode(findDiscountDto: FindDiscountDto) {
    const discount = await this.prisma.discount.findFirst({
      where: {
        promoCode: findDiscountDto.promoCode,
        is_Active: true,
        is_Deleted: false,
      },
      select: { percentage: true },
    });

    if (!discount) {
      return {
        discountAmount: 0,
        finalPrice: findDiscountDto.totalPrice,
        message: 'Invalid or expired promo code',
      };
    }
    const totalPrice = findDiscountDto.totalPrice;

    const discountPercentage = parseFloat(discount.percentage);

    const discountAmount = (discountPercentage / 100) * totalPrice;

    const finalPrice = totalPrice - discountAmount;

    return {
      discountAmount,
      finalPrice,
      message: `Discount of ${discount.percentage}% applied successfully`,
    };
  }

  async update(id: string, data: UpdateDiscountDto) {
    return this.prisma.discount.update({ where: { discountId: id }, data });
  }

  async remove(id: string) {
    return this.prisma.discount.update({
      where: { discountId: id },
      data: { is_Deleted: true },
    });
  }
}
