// NestJS imports
import { Injectable, Logger } from '@nestjs/common';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { MessageDto } from '../dto/message/message.dto';
import { ChannelEntity } from '../entities/channel.entity';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private messageRepository: MessageRepository) {}

  async createMessage(
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
  ): Promise<MessageEntity> {
    return this.messageRepository.create(content, sender, channel);
  }

  async getMessageDto(
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
  ): Promise<MessageDto> {
    const messageEntity: MessageEntity = await this.createMessage(
      sender,
      channel,
      content,
    );
    if (!messageEntity) {
      throw new Error('Failed to create message');
    }
    const transformedMessage: MessageDto = MessageDto.transform(messageEntity);
    if (!transformedMessage) {
      throw new Error('Failed to transform message');
    }

    return transformedMessage;
  }
}
