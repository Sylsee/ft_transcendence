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
import { ChannelEntity } from '../entities/channel.entity';
import { ChatEvent } from '../enum/chat-event.enum';
import { MessageService } from './message.service';
import { MuteUserService } from './mute-user.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    @Inject(forwardRef(() => 'COMMAND_MAP'))
    private readonly commandMap: Map<string, Command>,
    private muteUserService: MuteUserService,
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
        error.message.split('\n').forEach((line) => this.logger.warn(line));
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
    const userMute = await this.muteUserService.findOneByUserIdAndChannelId(
      sender.id,
      channel.id,
    );
    if (userMute) {
      const timeStamp = userMute.muteEndTime.getTime();
      const leftTime = timeStamp - Date.now();
      if (leftTime <= 0) {
        await this.muteUserService.delete(userMute);
      } else {
        this.sendEvent(server, sender, ChatEvent.CHANNEL_SERVER_MESSAGE, {
          channelId: channel.id,
          message: `You are muted for ${this.formatTime(leftTime)}`,
        });
        return;
      }
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
    await this.sendEvent(server, receivers, ChatEvent.CHANNEL_MESSAGE, message);
  }

  async handleDirectMessageChannel(
    server: Server,
    channel: ChannelEntity,
  ): Promise<void> {
    Promise.all(
      channel.users.map((user) => {
        this.sendChannelAvailableEvent(server, channel, user.id, user);
      }),
    );
  }

  async handlePublicOrPasswordProtectedChannel(
    server: Server,
    channel: ChannelEntity,
  ): Promise<void> {
    const socketMap = this.userService.getSocketMap();

    const eventPromises = Array.from(socketMap.entries()).map(([key, value]) =>
      this.sendChannelAvailableEvent(server, channel, value, key),
    );

    await Promise.all(eventPromises);
  }

  async handlePrivateChannel(
    server: Server,
    channel: ChannelEntity,
    wasPrivate: boolean,
  ): Promise<void> {
    const users = [...(channel.users ?? []), ...(channel.invitedUsers ?? [])];

    const eventPromises = users.map((user) => {
      this.sendChannelAvailableEvent(server, channel, user.id, user);
    });

    await Promise.all(eventPromises);

    if (!wasPrivate) {
      const usersIds: Set<string> = new Set(users.map((user) => user.id));

      const unavailableSocketsIds: string[] = [];
      this.userService.getSocketMap().forEach((value, key) => {
        if (!usersIds.has(value)) {
          unavailableSocketsIds.push(key);
        }
      });

      this.sendEvent(
        server,
        unavailableSocketsIds,
        ChatEvent.CHANNEL_UNAVAILABLE,
        {
          channelId: channel.id,
        },
      );
    }
  }

  async sendEvent(
    server: Server,
    user: string | UserEntity | Array<string | UserEntity>,
    event: ChatEvent,
    data: object | string,
  ): Promise<void> {
    const socketIds: string[] = [];

    const getSocketId = async (
      user: string | UserEntity,
    ): Promise<string | null> => {
      if (typeof user === 'string') {
        return user;
      } else {
        return await this.userService.getSocketID(user.id);
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
      socketIds.map((socketId) => {
        server.to(socketId).emit(event, data);
      }),
    );
  }

  async sendChannelAvailableEvent(
    server: Server,
    channel: ChannelEntity,
    userId: string,
    socket: string | UserEntity,
  ): Promise<void> {
    return new Promise((resolve) => {
      const channelDto = ChannelDto.transform(channel, userId);
      if (!channelDto) {
        resolve();
        return;
      }

      this.sendEvent(server, socket, ChatEvent.CHANNEL_AVAILABLE, channelDto);
      resolve();
    });
  }

  private formatTime(timeInMilliseconds: number): string {
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
    const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);

    let formattedTime = '';

    if (hours > 0) {
      formattedTime += `${hours} hours, `;
    }

    if (hours > 0 || minutes > 0) {
      formattedTime += `${minutes} minutes and `;
    }

    formattedTime += `${seconds} seconds`;

    return formattedTime.trim();
  }
}
