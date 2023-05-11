// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { removeUserFromList, userIdInList } from 'src/shared/list';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class DeOpCommand implements Command {
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
      throw new Error('You cannot deop users in a direct message channel');
    }

    if (!channel.owner || channel.owner.id !== sender.id) {
      throw new Error('Not the owner of this channel');
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
          const error = await this.deOpUser(sender, channel, user);
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

  private async deOpUser(
    sender: UserEntity,
    channel: ChannelEntity,
    deOpUser: UserEntity,
  ): Promise<string | void> {
    if (!userIdInList(channel.admins, deOpUser.id)) {
      return 'User is not an admin';
    }

    removeUserFromList(channel.admins, deOpUser.id);

    await this.channelService.save(channel);

    const socketID = await this.userService.getSocketId(deOpUser.id);
    if (socketID) {
      this.chatGateway.sendChannelAvailableEvent(
        channel,
        deOpUser.id,
        socketID,
      );
      this.chatGateway.sendEvent(socketID, ServerChatEvent.Notification, {
        content: `You have been deopped from ${channel.name}`,
      });
    }

    this.chatGateway.sendEvent(sender, ServerChatEvent.ChannelServerMessage, {
      channelId: channel.id,
      content: `${deOpUser.name} has been deopped`,
    });
  }
}
