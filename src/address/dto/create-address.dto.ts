import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @ApiProperty({ example: '123 Street Name', description: 'Address details' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Brooklyn', description: 'Area name' })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiProperty({ example: 'Apt 5B', description: 'Apartment details' })
  @IsString()
  apartment: string;

  @ApiProperty({ example: 'HOME', enum: AddressType, description: 'Type of address' })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}