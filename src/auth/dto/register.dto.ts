import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid Email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'Password with at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and more than 8 characters',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/, {
    message:
      'Invalid Password: Password should have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and more than 8 characters',
  })
  password: string;

  // @ApiProperty({
  //   example: '+923001234567',
  //   description:
  //     'Optional contact number in the format +923001234567 or 03001234567, 10-15 digits',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // @Matches(/^\+?\d{10,15}$/, {
  //   message:
  //     'Invalid Phone Number: Phone Number should be in the format +923001234567 or 03001234567 and between 10-15 digits',
  // })
  // contactNumber: string;

  // @ApiProperty({
  //   example: '1995-08-15',
  //   description: 'Optional date of birth in ISO format (YYYY-MM-DD)',
  //   required: false,
  // })
  // @IsOptional()
  // dateOfBirth: string;

  @ApiProperty({
    example: false,
    description: 'Subscribe to our newsletter',
    required: false,
  })
  @IsOptional()
  subscription: boolean;


  // @ApiProperty({
  //   example: 'https://example.com/profile-pic.jpg',
  //   description: 'Optional URL to the profile picture',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // @IsUrl()
  // profilePic: string;
}
