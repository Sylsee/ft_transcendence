// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TwoFactorAuthDto {
  @ApiProperty({
    description: 'The code of the user',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'the code must be 6 characters long' })
  code: string;
}
