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
export default class OpCommand implements Command {
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
      throw new Error('You cannot op users in a direct message channel');
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
          const error = await this.opUser(server, sender, channel, user);
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

  private async opUser(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    opUser: UserEntity,
  ): Promise<string | void> {
    if (this.channelService.userIdInList(channel.admins, opUser.id)) {
      return 'User is already an admin';
    }

    channel.admins.push(opUser);

    await this.channelService.save(channel);

    const socketID = await this.userService.getSocketID(opUser.id);
    if (socketID) {
      this.chatService.sendChannelAvailableEvent(
        server,
        channel,
        opUser.id,
        socketID,
      );
      this.chatService.sendEvent(server, socketID, ChatEvent.NOTIFICATION, {
        content: `You have been opped in ${channel.name}`,
      });
    }

    this.chatService.sendEvent(
      server,
      sender,
      ChatEvent.CHANNEL_SERVER_MESSAGE,
      {
        channelId: channel.id,
        content: `${opUser.name} has been opped`,
      },
    );
  }
}
