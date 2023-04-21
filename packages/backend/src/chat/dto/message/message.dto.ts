// NestJS imports
import { ApiProperty, PickType } from '@nestjs/swagger';

// Third-party imports
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// Local imports
import { MessageEntity } from 'src/chat/entities/message.entity';
import { UserDto } from 'src/user/dto/user.dto';

class SenderDto extends PickType(UserDto, [
  'id',
  'name',
  'profilePictureUrl',
] as const) {}

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
      channelId: message.channel.id,
      content: message.content,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        profilePictureUrl: message.sender.profilePictureUrl,
      },
      timestamp: message.createdAt,
    };
  }
}
