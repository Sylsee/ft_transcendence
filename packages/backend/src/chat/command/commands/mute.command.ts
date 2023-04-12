// NestJS imports
import { Injectable } from '@nestjs/common';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';
import { ChannelService } from 'src/chat/services/channel.service';
import { MuteUserService } from 'src/chat/services/mute-user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class MuteCommand implements Command {
  constructor(
    private userService: UserService,
    private channelService: ChannelService,
    private muteUserService: MuteUserService,
  ) {}

  async execute(
    server: Server,
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void> {
    if (channel.type === ChannelType.DIRECT_MESSAGE) {
      throw new Error('You cannot mute users in a direct message channel');
    }

    if (!this.channelService.userIdInList(channel.admins, sender.id)) {
      throw new Error('Not an admin of this channel');
    }

    if (!arg) {
      throw new Error('No username provided');
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
    user: UserEntity,
    channel: ChannelEntity,
    muteUser: UserEntity,
    time: number,
  ): Promise<string | void> {
    if (user.id === muteUser.id) {
      return 'You cannot mute yourself';
    }

    if (channel.owner && channel.owner.id === muteUser.id) {
      return 'You cannot mute the owner of the channel';
    }

    const muteEndTime = new Date();
    muteEndTime.setMinutes(muteEndTime.getMinutes() + time);

    await this.muteUserService.create(muteUser, channel, muteEndTime);
  }
}
