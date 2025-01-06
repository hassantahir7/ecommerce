import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
 

  @ApiProperty({
    example: 'abcdef12-3456-7890-ghij-klmnopqrst',
    description: 'Product Variant ID that this item corresponds to',
  })
  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product variant in the cart',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
