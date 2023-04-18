// Third party imports
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthDto {
  @ApiProperty({
    description: 'The code of the user',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
