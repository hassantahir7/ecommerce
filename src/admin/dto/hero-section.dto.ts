import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HeroSectionDto {
  @ApiProperty({
    example: 'https://dummy.com',
    description: 'Picture 1',
  })
  @IsUrl()
  @IsNotEmpty()
  pictureOne: string;

  @ApiProperty({
    example: 'https://dummy.com',
    description: 'Picture 1',
  })
  @IsUrl()
  @IsNotEmpty()
  pictureTwo: string;

  @ApiProperty({
    example: 'https://dummy.com',
    description: 'Picture 1',
  })
  @IsUrl()
  @IsNotEmpty()
  pictureThree: string;
}
