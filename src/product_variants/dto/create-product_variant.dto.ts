import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductVariantsDto {
  @ApiProperty({
    example: '12345678-abcd-efgh-ijkl-9876543210',
    description: 'Product ID that this variant belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'Red',
    description: 'Color of the product variant',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: 'M',
    description: 'Size of the product variant',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    example: 100,
    description: 'Stock quantity of this product variant',
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    example: 19.99,
    description: 'Price of this product variant',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
