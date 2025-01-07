import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 'Round-neck T-shirt',
    description: 'The style of the product',
  })
  @IsString()
  @IsOptional()
  style?: string;

  @ApiProperty({
    example: 'Round-neck T-shirt',
    description: 'The style of the product',
  })
  @IsString()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the product is clothing',
  })
  @IsBoolean()
  @IsOptional()
  isClothing?: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if the product is jewelry',
  })
  @IsBoolean()
  @IsOptional()
  isJewelry?: boolean;

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
