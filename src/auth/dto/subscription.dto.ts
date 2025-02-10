import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
  @ApiProperty({
    description: 'True or false',
    example: true,
  })
  @IsNotEmpty()
  subscription: boolean;
}
