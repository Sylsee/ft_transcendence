// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// Local imports
import { MessageEntity } from 'src/chat/entities/message.entity';
import { UserDto } from 'src/user/dto/user.dto';

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
  content: string;

  @ApiProperty({
    description: 'The sender of the message',
    type: UserDto,
    required: true,
  })
  @IsNotEmpty()
  sender: UserDto;

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
      channelId: message.channel.id,
      content: message.content,
      sender: UserDto.transform(message.sender),
      timestamp: message.createdAt,
    };
  }
}
