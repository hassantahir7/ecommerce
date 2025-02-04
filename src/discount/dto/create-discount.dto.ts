import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({ description: 'Discount percentage as a string' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'Percentage must be a valid decimal number' })
  percentage: string;
}
