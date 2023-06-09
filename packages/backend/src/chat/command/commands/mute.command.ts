// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { MuteUserService } from 'src/chat/services/mute-user.service';
import { userIdInList } from 'src/shared/list';
import { UserEntity } from 'src/user/entities/user.entity';
import { Command } from '../command.interface';

@Injectable()
export default class MuteCommand implements Command {
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
      throw new Error('You cannot mute users in a direct message channel');
    }

    if (!userIdInList(channel.admins, sender.id)) {
      throw new Error('Not an admin of this channel');
    }

    if (!arg) {
      throw new Error('Invalid arguments');
    }

    const args = arg.split(/\s+/);
    if (args.length !== 2) {
      throw new Error('Invalid arguments');
    }

    const user = await this.channelService.findUserInChannelByName(
      channel.id,
      args[0],
    );
    if (!user) {
      throw new Error(`User ${args[0]} not found`);
    }

    let duration = 0;
    try {
      duration = Number(args[1]);
    } catch (error) {
      throw new Error('Invalid duration');
    }

    if (duration <= 0) {
      throw new Error('Invalid duration');
    }

    const error = await this.muteUser(sender, channel, user, duration);
    if (error) {
      throw new Error(error);
    }
  }

  private async muteUser(
    sender: UserEntity,
    channel: ChannelEntity,
    muteUser: UserEntity,
    time: number,
  ): Promise<string | void> {
    if (sender.id === muteUser.id) {
      return 'You cannot mute yourself';
    }

    if (channel.owner && channel.owner.id === muteUser.id) {
      return 'You cannot mute the owner of the channel';
    }

    if (
      await this.muteUserService.isUserMuteInChannel(muteUser.id, channel.id)
    ) {
      return `User ${muteUser.name} is already muted`;
    }

    const muteEndTime = new Date();
    muteEndTime.setMinutes(muteEndTime.getMinutes() + time);

    await this.muteUserService.create(muteUser, channel, muteEndTime);

    this.chatGateway.sendEvent(sender, ServerChatEvent.ChannelServerMessage, {
      channelId: channel.id,
      content: `User ${muteUser.name} has been muted for ${time} minutes`,
    });
  }
}
