// NestJS imports
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { WsException } from '@nestjs/websockets';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Command } from '../command/command.interface';
import { ChannelDto } from '../dto/channel/channel.dto';
import { CommandArgsDto } from '../dto/command/command-args.dto';
import { MessageDto } from '../dto/message/message.dto';
import { ChannelEntity } from '../entities/channel.entity';
import { ChatEvent } from '../enum/chat-event.enum';
import { ChannelService } from './channel.service';
import { MessageService } from './message.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
    @Inject(forwardRef(() => 'COMMAND_MAP'))
    private readonly commandMap: Map<string, Command>,
  ) {}

  parseCommand(content: string): CommandArgsDto | null {
    const commandRegex = /^\/(\w*)\s*(.*)/;
    const commandMatch = content.match(commandRegex);

    if (commandMatch) {
      const commandName = commandMatch[1];
      const arg = commandMatch[2]?.trim() || '';
      return { commandName, arg };
    }
    return null;
  }

  async executeCommand(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    args: CommandArgsDto,
  ): Promise<void> {
    const command = this.commandMap.get(args.commandName);

    if (command) {
      try {
        await command.execute(server, sender, channel, args.arg);
      } catch (error) {
        this.logger.error(error);
        throw new WsException(error.message);
      }
    } else {
      throw new WsException(`Unknown command: ${args.commandName}`);
    }
  }

  async handleRegularMessage(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
  ): Promise<void> {
    if (await this.channelService.isUserMute(channel, sender.id)) {
      throw new WsException(`Sender is mute`);
    }

    const usersNotBlockingSender =
      await this.userService.findUsersNotBlockingUser(channel.users, sender.id);

    try {
      await this.handleNewMessage(
        server,
        sender,
        channel,
        content,
        usersNotBlockingSender,
      );
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async handleNewMessage(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
    receivers: UserEntity[],
  ): Promise<void> {
    // Create the message
    const message = await this.messageService.getFormattedMessage(
      sender,
      channel,
      content,
    );

    // Send the message to the channel
    await this.sendMessage(
      server,
      receivers,
      message,
      ChatEvent.CHANNEL_MESSAGE,
    );
  }

  async handleDirectMessageChannel(
    server: Server,
    channelEntity: ChannelEntity,
    channelDto: ChannelDto,
  ): Promise<void> {
    channelDto.isJoined = true;
    this.sendEvent(
      server,
      channelEntity.users,
      ChatEvent.CHANNEL_VISIBLE,
      channelDto,
    );
  }

  async handlePublicOrPasswordProtectedChannel(
    server: Server,
    channelEntity: ChannelEntity,
    channelDto: ChannelDto,
    newChannel = false,
  ): Promise<void> {
    if (newChannel) {
      const users = [...(channelEntity.users ?? [])];
      const usersIds: Set<string> = new Set(users.map((user) => user.id));

      const outChannelSocketsIds: string[] = [];
      const inChannelSocketsIds: string[] = [];
      this.userService.getSocketMap().forEach((value, key) => {
        if (usersIds.has(value)) {
          inChannelSocketsIds.push(key);
        } else {
          outChannelSocketsIds.push(key);
        }
      });

      channelDto.isJoined = false;
      await this.sendEvent(
        server,
        outChannelSocketsIds,
        ChatEvent.CHANNEL_VISIBLE,
        channelDto,
      );

      channelDto.isJoined = true;
      await this.sendEvent(
        server,
        inChannelSocketsIds,
        ChatEvent.CHANNEL_VISIBLE,
        channelDto,
      );
    } else {
      const users = [...(channelEntity.banUsers ?? [])];
      const usersIds: Set<string> = new Set(users.map((user) => user.id));

      const socketsIds: string[] = [];
      this.userService.getSocketMap().forEach((value, key) => {
        if (!usersIds.has(value)) {
          socketsIds.push(key);
        }
      });

      this.sendEvent(server, socketsIds, ChatEvent.CHANNEL_VISIBLE, channelDto);
    }
  }

  async handlePrivateChannel(
    server: Server,
    channelEntity: ChannelEntity,
    channelDto: ChannelDto,
    newChannel: boolean,
  ): Promise<void> {
    const users = [...(channelEntity.users ?? [])];

    if (newChannel) {
      const socketsIds: string[] = await this.userService.findSocketIdsByUsers(
        users,
      );

      channelDto.isJoined = true;
      this.sendEvent(server, socketsIds, ChatEvent.CHANNEL_VISIBLE, channelDto);
    } else {
      users.push(...(channelEntity.invitedUsers ?? []));
      const usersIds: Set<string> = new Set(users.map((user) => user.id));

      const visibleSocketsIds: string[] = [];
      const invisibleSocketsIds: string[] = [];
      this.userService.getSocketMap().forEach((value, key) => {
        if (!usersIds.has(value)) {
          invisibleSocketsIds.push(key);
        } else {
          visibleSocketsIds.push(key);
        }
      });

      this.sendEvent(server, invisibleSocketsIds, ChatEvent.CHANNEL_INVISIBLE, {
        channelID: channelEntity.id,
      });
      this.sendEvent(
        server,
        visibleSocketsIds,
        ChatEvent.CHANNEL_VISIBLE,
        channelDto,
      );
    }
  }

  async sendEvent(
    server: Server,
    user: string | UserEntity | Array<string | UserEntity>,
    event: string,
    data: object | string,
  ): Promise<void> {
    const socketIds: string[] = [];

    const getSocketId = async (
      user: string | UserEntity,
    ): Promise<string | null> => {
      if (typeof user === 'string') {
        return user;
      } else {
        return await this.userService.findSocketIdByUserID(user.id);
      }
    };

    if (Array.isArray(user)) {
      const promises = user.map(getSocketId);
      const ids = await Promise.all(promises);
      for (const id of ids) {
        if (id) {
          socketIds.push(id);
        }
      }
    } else {
      const socketId = await getSocketId(user);
      if (socketId) {
        socketIds.push(socketId);
      }
    }

    Promise.all(
      socketIds.map((socketId) => server.to(socketId).emit(event, data)),
    );
  }

  private async sendMessage(
    server: Server,
    users: UserEntity | UserEntity[],
    message: MessageDto | string | object,
    event: ChatEvent,
  ) {
    if (!Array.isArray(users)) {
      users = [users];
    }

    const socketIds = await this.userService.findSocketIdsByUsers(users);
    socketIds.forEach((socketId) => {
      server.to(socketId).emit(event, message);
    });
  }
}
