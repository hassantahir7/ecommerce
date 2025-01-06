import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
 
  @ApiProperty({
    example: true,
    description: 'Indicates whether the cart is active',
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the cart is deleted',
  })
  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;
}
