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
import { UserService } from 'src/user/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class UnInviteCommand implements Command {
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
      throw new Error('You cannot uninvite users to a direct message channel');
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
          const error = await this.unInviteUser(sender, channel, user);
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

  private async unInviteUser(
    sender: UserEntity,
    channel: ChannelEntity,
    uninvitedUser: UserEntity,
  ): Promise<string | void> {
    if (!userIdInList(channel.invitedUsers, uninvitedUser.id)) {
      return 'User is not invited';
    }

    removeUserFromList(channel.invitedUsers, uninvitedUser.id);

    await this.channelService.save(channel);

    // Notify invited user
    const socketID = await this.userService.getSocketID(uninvitedUser.id);
    if (socketID) {
      if (channel.type === ChannelType.PRIVATE) {
        this.chatGateway.sendEvent(socketID, ChatEvent.CHANNEL_UNAVAILABLE, {
          channelId: channel.id,
        });
      }
      this.chatGateway.sendEvent(socketID, ChatEvent.NOTIFICATION, {
        content: `You are uninvited to join ${channel.name}`,
      });
    }

    this.chatGateway.sendEvent(sender, ChatEvent.CHANNEL_SERVER_MESSAGE, {
      channelId: channel.id,
      content: `${uninvitedUser.name} has been uninvited to join ${channel.name}`,
    });
  }
}
