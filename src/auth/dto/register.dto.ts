import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  IsDateString,
  isNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid Email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/, {
    message:
      'Invalid Password: Password should have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and should have more than 8 characters',
  })
  password: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?\d{10,15}$/, {
    message:
      'Invalid Phone Number: Phone Number should be of format +923001234567, 03001234567 and between 10-15 Digits',
  })
  contactNumber: string;

  @IsOptional()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  profilePic: string;

}
