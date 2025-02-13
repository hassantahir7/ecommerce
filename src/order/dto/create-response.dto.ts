import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateResponseDto {
  @ApiProperty({
    description: 'Order Inquiry ID',
    example: '0aebeas19aawdzww',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  orderInquiriesId: string;

  @ApiProperty({
    description: 'Message',
    example: 'We will get back to it',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Email of user',
    example: 'hassantahir3556@gmail.com',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'General Issue',
    example: 'General Issue',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  subject: string;
}
