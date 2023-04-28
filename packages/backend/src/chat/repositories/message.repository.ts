// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from '../entities/channel.entity';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class MessageRepository {
  private readonly logger = new Logger(MessageRepository.name);

  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async create(
    content: string,
    sender: UserEntity,
    channel: ChannelEntity,
  ): Promise<MessageEntity> {
    const message = new MessageEntity();
    message.content = content;
    message.sender = sender;
    message.channel = channel;

    return this.messageRepository.save(message);
  }
}
