// NestJS imports
import { Injectable, Logger } from '@nestjs/common';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { ChatService } from 'src/chat/services/chat.service';
import { MuteUserService } from 'src/chat/services/mute-user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class UnMuteCommand implements Command {
  private readonly logger = new Logger(UnMuteCommand.name);

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private muteUserService: MuteUserService,
    private chatService: ChatService,
  ) {}

  async execute(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void> {
    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot unmute users from a direct message channel');
    }

    if (!this.channelService.userIdInList(channel.admins, sender.id)) {
      throw new Error('Not an admin of this channel');
    }

    if (!arg) {
      throw new Error('No username provided');
    }

    const usernames = arg.split(/\s+/);
    const errors: string[] = [];

    await Promise.all(
      usernames.map(async (username) => {
        const user = await this.channelService.findUserInChannelByName(
          channel.id,
          username,
        );
        if (user) {
          const error = await this.unMuteUser(server, sender, channel, user);
          if (error) {
            errors.push(error);
          }
        } else {
          errors.push(`User ${username} not found`);
        }
      }),
    );

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }

  private async unMuteUser(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    unMuteUser: UserEntity,
  ): Promise<string | void> {
    if (sender.id === unMuteUser.id) {
      return 'You cannot unmute yourself';
    }

    const user = await this.muteUserService.findOneByUserIdAndChannelId(
      unMuteUser.id,
      channel.id,
    );
    if (!user) {
      return 'User is not mute';
    }

    await this.muteUserService.delete(user);

    this.chatService.sendEvent(
      server,
      unMuteUser,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelID: channel.id,
        message: `You have been unmuted from ${channel.name}`,
      },
    );

    this.chatService.sendEvent(
      server,
      sender,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelID: channel.id,
        message: `${unMuteUser.name} has been unmuted`,
      },
    );
  }
}
