// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, Length } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

// Local imports
import { IsAlphanumericWithHyphenUnderscore } from 'src/validator/isAlphanumericWithHyphenUnderscore.validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The user name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @Length(1, 32)
  @IsAlphanumericWithHyphenUnderscore()
  @Transform(({ value }) => sanitizeHtml(value))
  name?: string;

  @ApiProperty({
    description: 'The user has enabled two-factor authentication',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;
}
