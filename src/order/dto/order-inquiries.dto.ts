import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class OrderInquiriesDto {
  @ApiProperty({
    description: 'Order Id',
    example: '0aebeas19aawdzww',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Any option for inquiry',
    example: 'Delivery Issues',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  options: string;

  @ApiProperty({
    description: 'Description for inquiry',
    example: 'Delivery was slow!',
    type: String,
  })
  @IsOptional()
  @IsString()
  description: string;
}
