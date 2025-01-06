import { Gender } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Shoes',
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/shoes-category.jpg',
    description: 'URL of the category image attachment',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  attachment: string;

  @ApiProperty({
    example: 'MEN',
    enum: Gender,
    description: 'Gender category (e.g., MEN, WOMEN, BOTH)',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
