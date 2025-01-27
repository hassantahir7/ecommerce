import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: 'T-Shirt',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Comfortable cotton t-shirt in various colors.',
    description: 'Description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '12345678-abcd-efgh-ijkl-9876543210',
    description: 'Category ID for the product',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: 'Base price of product.',
    description: 'The price of the product could be 20',
  })
  @IsNotEmpty()
  basePrice: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the product is limited edition',
  })
  @IsBoolean()
  @IsOptional()
  limitedAddition?: boolean;

  @ApiProperty({
    example: "CLOTHES",
    description: 'Indicates the product type.',
  })
  @IsEnum(ProductType)
  @IsOptional()
  productType?: ProductType;

  @ApiProperty({
    example: '100% Cotton',
    description: 'Composition of the product',
  })

  @IsString()
  @IsOptional()
  composition?: string;

  @ApiProperty({
    example: 'Medium',
    description: 'Weight of the product',
  })
  @IsString()
  @IsOptional()
  weight?: string;
}
