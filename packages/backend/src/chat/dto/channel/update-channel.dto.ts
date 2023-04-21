// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

// Local imports
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { IsAlphanumericWithHyphenUnderscore } from 'src/validator/isAlphanumericWithHyphenUnderscore.validator';

export class UpdateChannelDto {
  @ApiProperty({
    description: 'The name of the channel',
    example: 'channel-name',
    required: false,
  })
  @IsOptional()
  @Length(3, 20)
  @IsAlphanumericWithHyphenUnderscore()
  @Transform(({ value }) => sanitizeHtml(value))
  name: string;

  @ApiProperty({
    enum: ChannelType,
    isArray: true,
    description: 'The type of the channel',
    example: ChannelType.PUBLIC,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChannelType)
  type: ChannelType;

  @ApiProperty({
    description: 'The password of the channel',
    example: 'password',
    required: false,
  })
  @ValidateIf((o) => o.type === ChannelType.PASSWORD_PROTECTED && !o.password)
  @IsNotEmpty()
  @Length(5, 40)
  @IsString()
  password: string;
}
