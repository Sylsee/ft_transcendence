// NestJS imports
import { Injectable, Logger } from '@nestjs/common';

// Local imports
import { UserService } from 'src/user/user.service';
import { MessageDto } from '../dto/message/message.dto';
import { ChannelEntity } from '../entities/channel.entity';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private messageRepository: MessageRepository,
    private userService: UserService,
  ) {}

  async createMessage(
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
  ): Promise<MessageEntity> {
    return this.messageRepository.create(content, sender, channel);
  }

  async transformMessageEntities(
    messages: MessageEntity[],
  ): Promise<MessageDto[]> {
    if (!messages) return Promise.resolve([]);
    return Promise.all(messages.map((m) => this.transformMessageEntity(m)));
  }

  async transformMessageEntity(message: MessageEntity): Promise<MessageDto> {
    const sender = await this.userService.findOneById(message.sender.id);
    if (sender) {
      return {
        id: message.id,
        content: message.content,
        sender: {
          id: sender.id,
          name: sender.name,
          avatar: sender.avatarUrl,
        },
        timestamp: message.createdAt,
      };
    }
  }

  async getFormattedMessage(
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
  ): Promise<MessageDto> {
    const messageEntity = await this.createMessage(sender, channel, content);
    if (!messageEntity) {
      throw new Error('Failed to create message');
    }
    const transformedMessage = await this.transformMessageEntity(messageEntity);
    if (!transformedMessage) {
      throw new Error('Failed to transform message');
    }

    return transformedMessage;
  }
}
