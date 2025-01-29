import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { IsString, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Order Id',
    type: String,
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Status',
    type: String,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
