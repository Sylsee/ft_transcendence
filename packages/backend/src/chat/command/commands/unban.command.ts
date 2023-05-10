// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { removeUserFromList, userIdInList } from 'src/shared/list';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class UnBanCommand implements Command {
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
    if (channel.type == ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot unban users from a direct message channel');
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
          const error = await this.unBanUser(sender, channel, user);
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
    sender: UserEntity,
    channel: ChannelEntity,
    unbanUser: UserEntity,
  ): Promise<string | void> {
    if (!userIdInList(channel.banUsers, unbanUser.id)) {
      return `User ${unbanUser.name} is not banned`;
    }

    removeUserFromList(channel.banUsers, unbanUser.id);

    this.channelService.save(channel);

    const socketID = await this.userService.getSocketID(unbanUser.id);
    if (socketID) {
      if (channel.type !== ChannelType.PRIVATE) {
        this.chatGateway.sendChannelAvailableEvent(
          channel,
          unbanUser.id,
          socketID,
        );
      }
      this.chatGateway.sendEvent(socketID, ChatEvent.Notification, {
        content: `You have been unbanned from ${channel.name}`,
      });
    }

    this.chatGateway.sendEvent(sender, ChatEvent.ChannelServerMessage, {
      channelId: channel.id,
      content: `${unbanUser.name} has been unbanned`,
    });
  }
}
