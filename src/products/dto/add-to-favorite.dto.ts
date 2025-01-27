import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteProductDto {
  @ApiProperty({
    example: '1378had8-18931-1938dhk-187381',
    description: 'ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

}
