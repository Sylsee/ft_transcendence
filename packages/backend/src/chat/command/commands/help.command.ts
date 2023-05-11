// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelDto } from 'src/chat/dto/channel/channel.dto';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class HelpCommand implements Command {
  constructor(
    private userService: UserService,
    private channelService: ChannelService,
    private chatGateway: ChatGateway,
  ) {}

  async execute(
    sender: UserEntity,
    channel: ChannelEntity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _arg: string,
  ): Promise<void> {
    const channelDto = ChannelDto.transform(channel, sender.id);

    const commands = [
      {
        command: '/help',
        description: 'Show this help message',
        usage: '/help',
        requiredPermission: 'isMember',
      },
      {
        command: '/invite',
        description: 'Invite a user to a channel',
        usage: '/invite <username>',
        requiredPermission: 'isMember',
      },
      {
        command: '/uninvite',
        description: 'Uninvite a user from a channel',
        usage: '/uninvite <username>',
        requiredPermission: 'isMember',
      },
      {
        command: '/mute',
        description: 'Mute a user in a channel',
        usage: '/mute <username> <time in minutes>',
        requiredPermission: 'canModify',
      },
      {
        command: '/unmute',
        description: 'Unmute a user in a channel',
        usage: '/unmute <username>',
        requiredPermission: 'canModify',
      },
      {
        command: '/kick',
        description: 'Kick a user from a channel',
        usage: '/kick <username>',
        requiredPermission: 'canModify',
      },
      {
        command: '/ban',
        description: 'Ban a user from a channel',
        usage: '/ban <username>',
        requiredPermission: 'canModify',
      },
      {
        command: '/unban',
        description: 'Unban a user from a channel',
        usage: '/unban <username>',
        requiredPermission: 'canModify',
      },
      {
        command: '/op',
        description: 'Give a user admin privileges in a channel',
        usage: '/op <username>',
        requiredPermission: 'isOwner',
      },
      {
        command: '/deop',
        description: "Remove a user's admin privileges in a channel",
        usage: '/deop <username>',
        requiredPermission: 'isOwner',
      },
      {
        command: '/pong',
        description: 'Invite a user to play a game of pong',
        usage: '/pong <username>',
        requiredPermission: 'isMember',
      },
    ];

    const content: string[] = [];

    commands.forEach((command) => {
      let hasPermission = false;

      switch (command.requiredPermission) {
        case 'isMember':
          hasPermission = channelDto.permissions.isMember;
          break;
        case 'canModify':
          hasPermission = channelDto.permissions.canModify;
          break;
        case 'isOwner':
          hasPermission = channel.owner && channel.owner.id === sender.id;
          break;
      }

      if (hasPermission) {
        content.push(`${command.command} - ${command.description}`);
        content.push(`Usage: ${command.usage}`);
        content.push('');
      }
    });

    if (content[content.length - 1] === '') {
      content.pop();
    }

    this.chatGateway.sendEvent(sender, ServerChatEvent.ChannelServerMessage, {
      channelId: channel.id,
      content: content,
    });
  }
}
