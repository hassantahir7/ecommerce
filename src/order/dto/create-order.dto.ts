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

  @ApiProperty({ example: 'Hassan', description: 'First Name' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Tahir', description: 'Last Name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '03314665719', description: 'Contact Number' })
  @IsString()
    @IsNotEmpty()
  contactNumber: string;

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
