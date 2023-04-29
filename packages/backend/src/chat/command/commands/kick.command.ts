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
export default class KickCommand implements Command {
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
      throw new Error('You cannot kick users from a direct message channel');
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
        const user = await this.channelService.findUserInChannelByName(
          channel.id,
          username,
        );
        if (user) {
          const error = await this.kickUser(sender, channel, user);
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

  private async kickUser(
    sender: UserEntity,
    channel: ChannelEntity,
    kickUser: UserEntity,
  ): Promise<string | void> {
    if (channel.owner && channel.owner.id === kickUser.id) {
      return 'You cannot kick the owner of the channel';
    }

    if (sender.id === kickUser.id) {
      return 'You cannot kick yourself';
    }

    if (!userIdInList(channel.users, kickUser.id)) {
      return 'User is not in this channel';
    }

    removeUserFromList(channel.users, kickUser.id);
    removeUserFromList(channel.admins, kickUser.id);
    removeUserFromList(channel.invitedUsers, kickUser.id);

    await this.channelService.save(channel);

    // Send notification
    const socketId = await this.userService.getSocketID(kickUser.id);
    if (socketId) {
      if (channel.type === ChannelType.PRIVATE) {
        this.chatGateway.sendEvent(socketId, ChatEvent.ChannelUnavailable, {
          channelId: channel.id,
        });
      } else {
        this.chatGateway.sendChannelAvailableEvent(
          channel,
          kickUser.id,
          socketId,
        );
      }
      this.chatGateway.sendEvent(socketId, ChatEvent.Notification, {
        content: `You have been kicked from ${channel.name}`,
      });
    }

    this.chatGateway.sendEvent(sender, ChatEvent.ChannelServerMessage, {
      channelId: channel.id,
      content: `You have kicked ${kickUser.name} from ${channel.name}`,
    });
  }
}
