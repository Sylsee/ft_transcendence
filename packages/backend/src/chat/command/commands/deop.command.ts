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
export default class DeOpCommand implements Command {
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
          const error = await this.deOpUser(server, sender, channel, user);
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
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    deOpUser: UserEntity,
  ): Promise<string | void> {
    if (!this.channelService.userIdInList(channel.admins, deOpUser.id)) {
      return 'User is not an admin';
    }

    this.channelService.removeUserFromList(channel.admins, deOpUser.id);

    await this.channelService.save(channel);

    const socketID = await this.userService.getSocketID(deOpUser.id);
    if (socketID) {
      this.chatService.sendChannelAvailableEvent(
        server,
        channel,
        deOpUser.id,
        socketID,
      );
      this.chatService.sendEvent(server, socketID, ChatEvent.NOTIFICATION, {
        message: `You have been deopped from ${channel.name}`,
      });
    }

    this.chatService.sendEvent(
      server,
      sender,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelId: channel.id,
        message: `${deOpUser.name} has been deopped`,
      },
    );
  }
}
