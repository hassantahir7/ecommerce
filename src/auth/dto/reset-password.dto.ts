import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'OldP@ssw0rd!',
    description: 'Current password of the user',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'NewP@ssw0rd!',
    description:
      'New password with at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and more than 8 characters',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/, {
    message:
      'Invalid Password: Password should have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and more than 8 characters',
  })
  newPassword: string;

  @ApiProperty({
    example: 'NewP@ssw0rd!',
    description: 'Confirm the new password (should match newPassword)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/, {
    message:
      'Invalid Password: Password should have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and more than 8 characters',
  })
  confirmNewPassword: string;
}
