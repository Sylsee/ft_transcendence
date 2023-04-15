// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsDate, IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';
import { MessageEntity } from 'src/chat/entities/message.entity';

class SenderDto {
  @ApiProperty({
    description: 'The id of the sender',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the sender',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The avatar of the sender',
    example: 'https://example.com/avatar.png',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  avatarUrl: string;
}

export class MessageDto {
  @ApiProperty({
    description: 'The id of the recipient',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello world!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The sender of the message',
    type: SenderDto,
    required: true,
  })
  @IsNotEmpty()
  sender: SenderDto;

  @ApiProperty({
    description: 'The timestamp of the message',
    example: '2021-01-01T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;

  static transform(message: MessageEntity): MessageDto {
    return {
      id: message.id,
      content: message.content,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatarUrl: message.sender.avatarUrl,
      },
      timestamp: message.createdAt,
    };
  }
}
