import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressDto) {
    return await this.prisma.address.create({ data });
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
