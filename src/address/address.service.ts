import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressType } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async createAddress(data: CreateAddressDto) {
    const { userId, type } = data;

    if (type === AddressType.PRIMARY) {
     
      const existingPrimary = await this.prisma.address.findFirst({
        where: { userId, type: AddressType.PRIMARY },
      });

      if (existingPrimary) {
        await this.prisma.address.update({
          where: { addressId: existingPrimary.addressId },
          data: { type: AddressType.SECONDARY },
        });
      }
    }
    
    return await this.prisma.address.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.address.findMany();
  }

  async findOne(addressId: string) {
    const address = await this.prisma.address.findUnique({ where: { addressId } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }


  async findUserAddress(userId) {
    const address = await this.prisma.address.findMany({ where: { userId } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(addressId: string, data: UpdateAddressDto) {
    return await this.prisma.address.update({ where: { addressId }, data });
  }

  async remove(addressId: string) {
    return await this.prisma.address.delete({ where: { addressId } });
  }
}
