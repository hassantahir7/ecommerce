import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID for the payment', type: String })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Amount to be paid', type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Currency of the payment', type: String })
  @IsString()
  currency: string;
}
