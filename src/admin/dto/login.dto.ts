import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'Password with at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and more than 8 characters',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
