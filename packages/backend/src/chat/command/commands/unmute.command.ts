// NestJS imports
import { Injectable, Logger } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { MuteUserService } from 'src/chat/services/mute-user.service';
import { userIdInList } from 'src/shared/list';
import { UserEntity } from 'src/user/entities/user.entity';
import { Command } from '../command.interface';

@Injectable()
export default class UnMuteCommand implements Command {
  private readonly logger = new Logger(UnMuteCommand.name);

  constructor(
    private channelService: ChannelService,
    private muteUserService: MuteUserService,
    private chatGateway: ChatGateway,
  ) {}

  async execute(
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void> {
    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot unmute users from a direct message channel');
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
          const error = await this.unMuteUser(sender, channel, user);
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

  private async unMuteUser(
    sender: UserEntity,
    channel: ChannelEntity,
    unMuteUser: UserEntity,
  ): Promise<string | void> {
    if (sender.id === unMuteUser.id) {
      return 'You cannot unmute yourself';
    }

    const user = await this.muteUserService.findOneByUserIdAndChannelId(
      unMuteUser.id,
      channel.id,
    );
    if (!user) {
      return 'User is not mute';
    }

    await this.muteUserService.delete(user);

    this.chatGateway.sendEvent(unMuteUser, ChatEvent.CHANNEL_SERVER_MESSAGE, {
      channelId: channel.id,
      content: `You have been unmuted from ${channel.name}`,
    });

    this.chatGateway.sendEvent(sender, ChatEvent.CHANNEL_SERVER_MESSAGE, {
      channelId: channel.id,
      content: `${unMuteUser.name} has been unmuted`,
    });
  }
}
