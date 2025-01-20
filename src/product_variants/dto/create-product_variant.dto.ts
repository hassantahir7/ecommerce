import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductVariantsDto {
  @ApiProperty({
    example: 'c35af475-3ea1-4b82-973b-fed7b608d712',
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
    example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFFfgKQ-yMbAeM1Z2LcaEcnjgkjcqASTgadQ&s',
    description: 'Picture of the product variant',
  })
  @IsUrl()
  @IsNotEmpty()
  attachment: string;

  @ApiProperty({
    example: false,
    description: 'Check if the product has duo tone',
  })
  @IsNotEmpty()
  isDuotone: boolean;

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
