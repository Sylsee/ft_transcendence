// NestJS imports
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

// Third-party imports
import * as bcrypt from 'bcrypt';

// Local imports
import { removeUserFromList, userIdInList } from 'src/shared/list';
import { hashPassword } from 'src/shared/password';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { ChatGateway } from '../chat.gateway';
import { ChannelDto } from '../dto/channel/channel.dto';
import { CreateChannelDto } from '../dto/channel/create-channel.dto';
import { UpdateChannelDto } from '../dto/channel/update-channel.dto';
import { MessageDto } from '../dto/message/message.dto';
import { ChannelEntity } from '../entities/channel.entity';
import { ChannelType } from '../enum/channel-type.enum';
import { ChatEvent } from '../enum/chat-event.enum';
import { ChannelRepository } from '../repositories/channel.repository';

@Injectable()
export class ChannelService {
  private logger = new Logger(ChannelService.name);

  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private channelRepository: ChannelRepository,
    private userService: UserService,
  ) {}

  // TODO: Remove this method
  async findAllChannels(): Promise<ChannelEntity[] | void> {
    return this.channelRepository.findWithRelations([
      'owner',
      'messages',
      'users',
      'admins',
      'invitedUsers',
      'banUsers',
      'muteUsers',
    ]);
  }

  // -------------------- Database Management -------------------

  async create(
    createChannelDto: CreateChannelDto,
    user: UserEntity,
  ): Promise<ChannelDto> {
    const name = createChannelDto.name || user.name;

    const owner =
      createChannelDto.type !== ChannelType.DIRECT_MESSAGE ? user : null;
    const admins =
      createChannelDto.type !== ChannelType.DIRECT_MESSAGE ? [user] : [];
    const users = [user];

    if (createChannelDto.type === ChannelType.DIRECT_MESSAGE) {
      if (
        await this.channelRepository.findDmChannel(
          user.id,
          createChannelDto.otherUserId,
        )
      ) {
        throw new ForbiddenException(
          'Users already have a direct message channel',
        );
      }

      const dmUser = await this.userService.findOneById(
        createChannelDto.otherUserId,
      );
      if (!dmUser) {
        throw new NotFoundException('User not found');
      }
      users.push(dmUser);
    }

    const hashedPassword = createChannelDto.password
      ? await hashPassword(createChannelDto.password)
      : null;

    const type = createChannelDto.type || ChannelType.PRIVATE;

    const createdChannel = await this.channelRepository.create(
      name,
      owner,
      admins,
      users,
      type,
      hashedPassword,
    );

    await this.chatGateway.sendChannelAvailablity(createdChannel, true);

    return ChannelDto.transform(createdChannel, user.id);
  }

  async save(channel: ChannelEntity): Promise<ChannelEntity> {
    return this.channelRepository.save(channel);
  }

  async update(
    userId: string,
    channelId: string,
    updateChannelDto: UpdateChannelDto,
  ): Promise<ChannelDto> {
    if (updateChannelDto.type === ChannelType.DIRECT_MESSAGE) {
      throw new ForbiddenException('Cannot change a channel to Direct Message');
    }

    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelId,
      ['owner', 'users', 'admins', 'invitedUsers', 'banUsers'],
    );

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new ForbiddenException('Cannot update a Direct Message channel');
    }
    if (!userIdInList(channel.admins, userId)) {
      throw new ForbiddenException('Not an admin of this channel');
    }

    const wasPrivate = channel.type === ChannelType.PRIVATE;

    channel.name = updateChannelDto.name ?? channel.name;
    channel.type = updateChannelDto.type ?? channel.type;

    if (updateChannelDto.password) {
      channel.password = await hashPassword(updateChannelDto.password);
    }

    await this.channelRepository.save(channel);
    await this.chatGateway.sendChannelAvailablity(channel, wasPrivate);

    return ChannelDto.transform(channel, userId);
  }

  async delete(userId: string, channelId: string): Promise<void> {
    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelId,
      ['users', 'owner', 'admins', 'banUsers'],
    );
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // If not direct message and user is not in the channel
    if (
      channel.type !== ChannelType.DIRECT_MESSAGE &&
      !userIdInList(channel.users, userId)
    ) {
      if (channel.owner && channel.owner.id !== userId) {
        throw new ForbiddenException('Not the owner of this channel');
      }
      if (!channel.owner && !userIdInList(channel.admins, userId)) {
        throw new ForbiddenException('Not an admin of this channel');
      }
    }

    await this.chatGateway.sendChannelUnavailability(channel);

    this.channelRepository.delete(channel);
  }

  async findUserInChannelByName(
    channelId: string,
    username: string,
  ): Promise<UserEntity | void> {
    return this.channelRepository.findUserInChannelByName(channelId, username);
  }

  async findOneByIdWithRelations(
    id: string,
    relations: string[],
  ): Promise<ChannelEntity | void> {
    return this.channelRepository.findOneByIdWithRelations(id, relations);
  }

  async findAvailableChannels(userID: string): Promise<ChannelDto[]> {
    const channels = await this.channelRepository.findAvailableChannels(userID);
    if (!channels) {
      return [];
    }

    return Promise.all(
      channels.map((channel) => {
        return ChannelDto.transform(channel, userID);
      }),
    );
  }

  async findMessagesInChannel(
    userId: string,
    channelId: string,
  ): Promise<MessageDto[]> {
    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelId,
      ['users', 'messages', 'messages.sender', 'messages.channel'],
    );
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (!userIdInList(channel.users, userId)) {
      throw new ForbiddenException('User is not in channel');
    }

    return await Promise.all(
      channel.messages?.map((message) => {
        return MessageDto.transform(message);
      }),
    );
  }

  // ---------------------- User Management ----------------------

  async joinChannel(
    user: UserEntity,
    channelId: string,
    password?: string,
  ): Promise<ChannelDto> {
    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelId,
      ['users', 'banUsers', 'invitedUsers', 'admins', 'owner'],
    );
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new ForbiddenException('Cannot join a Direct Message channel');
    }

    if (userIdInList(channel.users, user.id)) {
      throw new ForbiddenException('Already in this channel');
    }

    if (userIdInList(channel.banUsers, user.id)) {
      throw new ForbiddenException('Banned from this channel');
    }

    if (channel.type === ChannelType.PASSWORD_PROTECTED) {
      if (!password) {
        throw new BadRequestException('Password required');
      }

      const passwordMatch = await bcrypt.compare(password, channel.password);
      if (!passwordMatch) {
        throw new BadRequestException('Invalid password');
      }
    }

    if (channel.type === ChannelType.PRIVATE) {
      if (!userIdInList(channel.invitedUsers, user.id)) {
        throw new ForbiddenException('Not invited to this channel');
      }
    }

    removeUserFromList(channel.invitedUsers, user.id);
    channel.users.push(user);

    await this.channelRepository.save(channel);

    this.chatGateway.sendEvent(user, ChatEvent.Notification, {
      content: `You joined the channel ${channel.name}`,
    });

    this.chatGateway.sendEvent(channel.users, ChatEvent.ChannelServerMessage, {
      channelId: channel.id,
      content: `${user.name} joined the channel`,
    });

    return ChannelDto.transform(channel, user.id);
  }

  async leaveChannel(user: UserEntity, channelId: string): Promise<void> {
    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelId,
      ['users', 'owner', 'admins', 'banUsers', 'invitedUsers'],
    );
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.type == ChannelType.DIRECT_MESSAGE) {
      throw new ForbiddenException('Cannot leave a Direct Message channel');
    }

    if (!userIdInList(channel.users, user.id)) {
      throw new ForbiddenException('Not in this channel');
    }

    this.chatGateway.sendEvent(user.id, ChatEvent.Notification, {
      content: `You left the channel ${channel.name}`,
    });

    // Delete channel if no users left
    if (channel.users.length === 1) {
      await this.chatGateway.sendChannelUnavailability(channel);

      this.channelRepository.delete(channel);
    } else {
      removeUserFromList(channel.users, user.id);
      removeUserFromList(channel.admins, user.id);

      if (channel.owner && channel.owner.id === user.id) {
        channel.owner = null;

        // Send channel available event to all admins for the new permissions
        const users = [...(channel.admins ?? [])];

        const eventPromises = users.map((u) => {
          this.chatGateway.sendChannelAvailableEvent(channel, u.id, u);
        });

        await Promise.all(eventPromises);
      }

      this.channelRepository.save(channel);

      this.chatGateway.sendEvent(
        channel.users,
        ChatEvent.ChannelServerMessage,
        {
          channelId: channel.id,
          content: `${user.name} left the channel`,
        },
      );

      // Send channel avaibility event to the user
      const channelDto = ChannelDto.transform(channel, user.id);
      if (channelDto === null) {
        this.chatGateway.sendEvent(user, ChatEvent.ChannelUnavailable, {
          channelId: channel.id,
        });
      } else {
        this.chatGateway.sendEvent(
          user,
          ChatEvent.ChannelAvailable,
          channelDto,
        );
      }
    }
  }
}
