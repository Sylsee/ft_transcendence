// NestJS imports
import { Injectable } from '@nestjs/common';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChannelDto } from 'src/chat/dto/channel/channel.dto';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { ChatService } from 'src/chat/services/chat.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class InviteCommand implements Command {
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
      throw new Error('You cannot invite users to a direct message channel');
    }

    if (!this.channelService.userIdInList(channel.admins, sender.id)) {
      throw new Error('Not an admin of this channel');
    }

    if (!this.channelService.userIdInList(channel.users, sender.id)) {
      throw new Error('You are not in this channel');
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
          const error = await this.inviteUser(server, sender, channel, user);
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

  private async inviteUser(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    invitedUser: UserEntity,
  ): Promise<string | void> {
    if (
      this.channelService.userIdInList(channel.invitedUsers, invitedUser.id)
    ) {
      return 'User is already invited';
    }

    if (this.channelService.userIdInList(channel.users, invitedUser.id)) {
      return 'User is already in this channel';
    }

    if (this.channelService.userIdInList(channel.banUsers, invitedUser.id)) {
      return 'User is banned from this channel';
    }

    channel.invitedUsers.push(invitedUser);

    await this.channelService.save(channel);

    // Notify invited user
    const socketID = await this.userService.findSocketIdByUserID(
      invitedUser.id,
    );
    if (channel.type === ChannelType.PRIVATE) {
      const channelDto = ChannelDto.transform(channel, false);
      this.chatService.sendEvent(
        server,
        socketID,
        ChatEvent.CHANNEL_VISIBLE,
        channelDto,
      );
    }
    this.chatService.sendEvent(
      server,
      socketID,
      ChatEvent.NOTIFICATION_INVITE,
      {
        sender: sender.name,
        channelID: {
          id: channel.id,
          name: channel.name,
        },
        message: `${sender.name} invited you to ${channel.name}`,
      },
    );

    this.chatService.sendEvent(server, sender, ChatEvent.CHANNEL_MESSAGE, {
      channelID: channel.id,
      message: `Invited ${invitedUser.name} to ${channel.name}`,
    });
  }
}
