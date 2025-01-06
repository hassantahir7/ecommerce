import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto {
  @ApiProperty({
    description: 'Email address of the user to be verified',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Verification code sent to the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
