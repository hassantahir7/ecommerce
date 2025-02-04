import { ApiProperty } from '@nestjs/swagger';
import { AddressType, PaymentMethod } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateOrderDto {
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

  @ApiProperty({
    example: 'HOME',
    enum: AddressType,
    description: 'Type of address',
  })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty({
    description: 'The contact number of the user placing the order',
    type: String,
  })
  @IsString()
  contactNumber: string;

  @ApiProperty({
    description: 'Any discount applied to the order',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    description: 'The payment method chosen for the order (e.g., CASH, CARD)',
    type: String,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
