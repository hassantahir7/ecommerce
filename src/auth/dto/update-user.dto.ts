import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEmail } from 'class-validator';

export class UpdateUserDto {
//   @IsOptional()
//   @IsString()
//   profilePic?: string;

@ApiProperty({
    description: 'The first name of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The contact number of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiProperty({
    description: 'The date of birth of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

//   @IsOptional()
//   @IsString()
//   address?: string;

//   @IsOptional()
//   @IsBoolean()
//   subscription?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   is_emailVerified?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   is_contactNumberVerified?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   is_Active?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   is_Deleted?: boolean;
}
