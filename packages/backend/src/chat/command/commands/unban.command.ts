// NestJS imports
import { Injectable } from '@nestjs/common';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { ChatService } from 'src/chat/services/chat.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class UnBanCommand implements Command {
  constructor(
    private userService: UserService,
    private channelService: ChannelService,
    private chatService: ChatService,
  ) {}

  async execute(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void> {
    if (channel.type == ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot unban users from a direct message channel');
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
        const user = await this.userService.findOneByName(username);
        if (user) {
          const error = await this.unBanUser(server, sender, channel, user);
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

  private async unBanUser(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    unbanUser: UserEntity,
  ): Promise<string | void> {
    if (!this.channelService.userIdInList(channel.banUsers, unbanUser.id)) {
      return `User ${unbanUser.name} is not banned`;
    }

    this.channelService.removeUserFromList(channel.banUsers, unbanUser.id);

    this.channelService.save(channel);

    const socketID = await this.userService.getSocketID(unbanUser.id);
    if (socketID) {
      if (channel.type !== ChannelType.PRIVATE) {
        this.chatService.sendChannelAvailableEvent(
          server,
          channel,
          unbanUser.id,
          socketID,
        );
      }
      this.chatService.sendEvent(server, socketID, ChatEvent.NOTIFICATION, {
        message: `You have been unbanned from ${channel.name}`,
      });
    }

    this.chatService.sendEvent(
      server,
      sender,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelID: channel.id,
        message: `${unbanUser.name} has been unbanned`,
      },
    );
  }
}
