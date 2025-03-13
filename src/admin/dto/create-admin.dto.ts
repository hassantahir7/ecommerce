
import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ description: 'adminId of the Admin', example: 'example_string' })
  @IsString()
  adminId: string;

  @ApiProperty({ description: 'name of the Admin', example: 'example_string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'email of the Admin', example: 'example_string' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'password of the Admin', example: 'example_string' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'createdAt of the Admin', example: 'example_value' })
  @IsOptional()
  createdAt: any;

  @ApiProperty({ description: 'updatedAt of the Admin', example: 'example_value' })
  @IsOptional()
  updatedAt: any;
}
