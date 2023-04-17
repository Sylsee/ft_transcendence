// NestJS imports
import { Injectable } from '@nestjs/common';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { ChatService } from 'src/chat/services/chat.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ChannelService } from '../../services/channel.service';
import { Command } from '../command.interface';

@Injectable()
export default class BanCommand implements Command {
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
    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot ban users from a direct message channel');
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
          const error = await this.banUser(server, sender, channel, user);
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

  private async banUser(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    banUser: UserEntity,
  ): Promise<string | void> {
    if (channel.owner && channel.owner.id === banUser.id) {
      return 'You cannot ban the owner of the channel';
    }

    if (sender.id === banUser.id) {
      return 'You cannot ban yourself';
    }

    if (this.channelService.userIdInList(channel.banUsers, banUser.id)) {
      return `User ${banUser.name} is already banned`;
    }

    // Update channel data
    channel.banUsers.push(banUser);

    this.channelService.removeUserFromList(channel.users, banUser.id);
    this.channelService.removeUserFromList(channel.invitedUsers, banUser.id);

    await this.channelService.save(channel);

    // Send events to the banned user
    const socketID = await this.userService.getSocketID(banUser.id);
    if (socketID) {
      this.chatService.sendEvent(
        server,
        socketID,
        ChatEvent.CHANNEL_UNAVAILABILITY,
        {
          channelID: channel.id,
        },
      );
      this.chatService.sendEvent(server, socketID, ChatEvent.NOTIFICATION, {
        message: `You have been banned from ${channel.name}`,
      });
    }

    this.chatService.sendEvent(
      server,
      sender,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelID: channel.id,
        message: `User ${banUser.name} has been banned`,
      },
    );
  }
}
