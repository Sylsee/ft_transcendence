// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { removeUserFromList, userIdInList } from 'src/shared/list';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { ChannelService } from '../../services/channel.service';
import { Command } from '../command.interface';

@Injectable()
export default class BanCommand implements Command {
  constructor(
    private userService: UserService,
    private channelService: ChannelService,
    private chatGateway: ChatGateway,
  ) {}

  async execute(
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void> {
    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot ban users from a direct message channel');
    }

    if (!userIdInList(channel.admins, sender.id)) {
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
          const error = await this.banUser(sender, channel, user);
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

    if (userIdInList(channel.banUsers, banUser.id)) {
      return `User ${banUser.name} is already banned`;
    }

    // Update channel data
    channel.banUsers.push(banUser);

    removeUserFromList(channel.users, banUser.id);
    removeUserFromList(channel.invitedUsers, banUser.id);

    await this.channelService.save(channel);

    // Send events to the banned user
    const socketID = await this.userService.getSocketID(banUser.id);
    if (socketID) {
      this.chatGateway.sendEvent(socketID, ChatEvent.CHANNEL_UNAVAILABLE, {
        channelId: channel.id,
      });
      this.chatGateway.sendEvent(socketID, ChatEvent.NOTIFICATION, {
        content: `You have been banned from ${channel.name}`,
      });
    }

    this.chatGateway.sendEvent(sender, ChatEvent.CHANNEL_SERVER_MESSAGE, {
      channelId: channel.id,
      content: `User ${banUser.name} has been banned`,
    });
  }
}
