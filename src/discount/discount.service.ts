
// discount.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';


@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  generatePromoCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  async create(data: CreateDiscountDto) {
    const promoCode = data.promoCode || this.generatePromoCode();
    return this.prisma.discount.create({
      data: { ...data, promoCode },
    });
  }

  async findAll() {
    return this.prisma.discount.findMany({ where: { is_Deleted: false } });
  }

  async findOne(id: string) {
    return this.prisma.discount.findUnique({ where: { discountId: id } });
  }

  async update(id: string, data: UpdateDiscountDto) {
    return this.prisma.discount.update({ where: { discountId: id }, data });
  }

  async remove(id: string) {
    return this.prisma.discount.update({ where: { discountId: id }, data: { is_Deleted: true } });
  }
}