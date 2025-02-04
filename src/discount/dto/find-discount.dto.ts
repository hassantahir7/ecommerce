import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class FindDiscountDto {
  @ApiProperty({ description: 'Discount percentage as a string' })
  @IsNotEmpty()
  @IsString()
  promoCode: string;

  @ApiPropertyOptional({ description: 'Indicates if the discount is active' })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
