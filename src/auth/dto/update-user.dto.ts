import { IsOptional, IsString, IsBoolean, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  subscription?: boolean;

  @IsOptional()
  @IsBoolean()
  is_emailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  is_contactNumberVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  is_Active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_Deleted?: boolean;
}
