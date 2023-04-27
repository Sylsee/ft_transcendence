// NestJS imports
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

// Local imports
import { WsException } from '@nestjs/websockets';
import { formatTime } from 'src/shared/time';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ChatGateway } from '../chat.gateway';
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
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async executeCommand(
    sender: UserEntity,
    channel: ChannelEntity,
    args: CommandArgsDto,
  ): Promise<void> {
    const command = this.commandMap.get(args.commandName);

    if (command) {
      try {
        await command.execute(sender, channel, args.arg);
      } catch (error) {
        error.message.split('\n').forEach((line) => this.logger.warn(line));
        throw new WsException(error.message);
      }
    } else {
      throw new WsException(`Unknown command: ${args.commandName}`);
    }
  }

  async handleRegularMessage(
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
        this.chatGateway.sendEvent(sender, ChatEvent.CHANNEL_SERVER_MESSAGE, {
          channelId: channel.id,
          content: `You are muted for ${formatTime(leftTime)}`,
        });
        return;
      }
    }

    const usersNotBlockingSender =
      await this.userService.findUsersNotBlockingUser(channel.users, sender.id);

    try {
      await this.handleNewMessage(
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
    sender: UserEntity,
    channel: ChannelEntity,
    content: string,
    receivers: UserEntity[],
  ): Promise<void> {
    // Create the message
    const message = await this.messageService.getMessageDto(
      sender,
      channel,
      content,
    );

    // Send the message to the channel
    await this.chatGateway.sendEvent(
      receivers,
      ChatEvent.CHANNEL_MESSAGE,
      message,
    );
  }

  async handleDirectMessageChannel(channel: ChannelEntity): Promise<void> {
    Promise.all(
      channel.users.map((user) => {
        this.chatGateway.sendChannelAvailableEvent(channel, user.id, user);
      }),
    );
  }

  async handlePublicOrPasswordProtectedChannel(
    channel: ChannelEntity,
  ): Promise<void> {
    const socketMap = this.userService.getSocketMap();

    const eventPromises = Array.from(socketMap.entries()).map(([key, value]) =>
      this.chatGateway.sendChannelAvailableEvent(channel, value, key),
    );

    await Promise.all(eventPromises);
  }

  async handlePrivateChannel(
    channel: ChannelEntity,
    wasPrivate: boolean,
  ): Promise<void> {
    const users = [...(channel.users ?? []), ...(channel.invitedUsers ?? [])];

    const eventPromises = users.map((user) => {
      this.chatGateway.sendChannelAvailableEvent(channel, user.id, user);
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

      this.chatGateway.sendEvent(
        unavailableSocketsIds,
        ChatEvent.CHANNEL_UNAVAILABLE,
        {
          channelId: channel.id,
        },
      );
    }
  }

  async sendChannelAvailableEvent(
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

      this.chatGateway.sendEvent(
        socket,
        ChatEvent.CHANNEL_AVAILABLE,
        channelDto,
      );
      resolve();
    });
  }

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
}
