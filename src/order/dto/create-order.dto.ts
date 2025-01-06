import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { IsString, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The delivery address for the order',
    type: String,
  })
  @IsString()
  address: string;

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
