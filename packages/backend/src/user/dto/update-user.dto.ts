// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { Transform } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

// Local imports
import { IsAlphanumericWithHyphenUnderscore } from 'src/validator/isAlphanumericWithHyphenUnderscore.validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @Length(1, 32)
  @IsAlphanumericWithHyphenUnderscore()
  @Transform(({ value }) => sanitizeHtml(value))
  name: string;
}
