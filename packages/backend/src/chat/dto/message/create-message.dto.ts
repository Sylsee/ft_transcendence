// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The id of the channel',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  channelId: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello world!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  @Transform(({ value }) => sanitizeHtml(value))
  content: string;
}
