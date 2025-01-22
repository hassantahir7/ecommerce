import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VariantsByProductDto {
  @ApiProperty({
    example: 'c35af475-3ea1-4b82-973b-fed7b608d712',
    description: 'Product ID that this variant belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
