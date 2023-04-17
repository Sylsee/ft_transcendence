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
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
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

  // ------------------------- Debug ----------------------------

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

    if (!this.userIdInList(channel.users, userId)) {
      throw new ForbiddenException('User is not in channel');
    }

    return await Promise.all(
      channel.messages?.map((message) => {
        return MessageDto.transform(message);
      }),
    );
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

    const type = createChannelDto.type || ChannelType.PRIVATE;

    const createdChannel = await this.channelRepository.create(
      name,
      owner,
      admins,
      users,
      type,
    );

    await this.chatGateway.sendChannelAvailablity(createdChannel, false);

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
    if (!this.userIdInList(channel.admins, userId)) {
      throw new ForbiddenException('Not an admin of this channel');
    }

    const wasPrivate = channel.type === ChannelType.PRIVATE;

    channel.name = updateChannelDto.name ?? channel.name;
    channel.type = updateChannelDto.type ?? channel.type;

    if (updateChannelDto.password) {
      const salt = await bcrypt.genSalt();
      channel.password = await bcrypt.hash(updateChannelDto.password, salt);
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

    if (channel.owner && channel.owner.id !== userId) {
      throw new ForbiddenException('Not the owner of this channel');
    }
    if (!channel.owner && !this.userIdInList(channel.admins, userId)) {
      throw new ForbiddenException('Not an admin of this channel');
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

  // ---------------------- User Management ----------------------

  async joinChannel(
    user: UserEntity,
    channelID: string,
    password?: string,
  ): Promise<ChannelDto> {
    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelID,
      ['users', 'banUsers', 'invitedUsers', 'admins', 'owner'],
    );
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (this.userIdInList(channel.users, user.id)) {
      throw new ForbiddenException('Already in this channel');
    }

    if (this.userIdInList(channel.banUsers, user.id)) {
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
      if (!this.userIdInList(channel.invitedUsers, user.id)) {
        throw new ForbiddenException('Not invited to this channel');
      }
    }

    this.removeUserFromList(channel.invitedUsers, user.id);
    channel.users.push(user);

    await this.channelRepository.save(channel);

    this.chatGateway.sendEvent(user, ChatEvent.NOTIFICATION, {
      message: `You joined the channel ${channel.name}`,
    });

    this.chatGateway.sendEvent(
      channel.users,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelID: channel.id,
        message: `${user.name} joined the channel`,
      },
    );

    return ChannelDto.transform(channel, user.id);
  }

  async leaveChannel(user: UserEntity, channelID: string): Promise<void> {
    const channel = await this.channelRepository.findOneByIdWithRelations(
      channelID,
      ['users', 'owner', 'admins', 'banUsers'],
    );
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (!this.userIdInList(channel.users, user.id)) {
      throw new ForbiddenException('Not in this channel');
    }

    if (channel.owner && channel.owner.id === user.id) {
      channel.owner = null;

      const users = [...(channel.admins ?? [])];

      const eventPromises = users.map((user) => {
        this.chatGateway.sendChannelAvailableEvent(channel, user.id, user);
      });

      await Promise.all(eventPromises);
    }

    this.removeUserFromList(channel.users, user.id);
    if (channel.users.length === 0) {
      this.channelRepository.delete(channel);
    } else {
      this.removeUserFromList(channel.admins, user.id);

      this.channelRepository.save(channel);
    }

    this.chatGateway.sendEvent(user.id, ChatEvent.NOTIFICATION, {
      message: `You left the channel ${channel.name}`,
    });

    if (channel.users.length === 0) {
      this.chatGateway.sendChannelUnavailability(channel);
    } else {
      this.chatGateway.sendEvent(
        channel.users,
        ChatEvent.CHANNEL_SERVER_MESSAGE,
        {
          channelID: channel.id,
          message: `${user.name} left the channel`,
        },
      );
    }
  }

  // ------------------------- Utils ----------------------------

  async findOneByIdWithRelations(
    id: string,
    relations: string[],
  ): Promise<ChannelEntity | void> {
    return this.channelRepository.findOneByIdWithRelations(id, relations);
  }

  removeUserFromList(userList: UserEntity[], userId: string): void {
    const index = userList.findIndex((user) => user.id === userId);
    if (index !== -1) {
      userList.splice(index, 1);
    }
  }

  userIdInList(list: UserEntity[], userId: string): boolean {
    return list && list.findIndex((user) => user.id === userId) !== -1;
  }
}
