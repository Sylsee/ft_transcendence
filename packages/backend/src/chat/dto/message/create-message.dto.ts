// Third-party imports
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  channelId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  @Transform(({ value }) => sanitizeHtml(value))
  content: string;
}
