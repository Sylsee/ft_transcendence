// NestJS imports
import { Provider } from '@nestjs/common';

// Local imports
import { UserService } from 'src/user/services/user.service';
import { ChatGateway } from '../chat.gateway';
import { ChannelService } from '../services/channel.service';
import { MuteUserService } from '../services/mute-user.service';
import { Command } from './command.interface';
import BanCommand from './commands/ban.command';
import DeOpCommand from './commands/deop.command';
import InviteCommand from './commands/invite.command';
import KickCommand from './commands/kick.command';
import MuteCommand from './commands/mute.command';
import OpCommand from './commands/op.command';
import UnBanCommand from './commands/unban.command';
import UnInviteCommand from './commands/uninvite.command';
import UnMuteCommand from './commands/unmute.command';

const commandMapFactory = (
  channelService: ChannelService,
  userService: UserService,
  muteUserService: MuteUserService,
  chatGateway: ChatGateway,
  kickCommand: KickCommand,
  inviteCommand: InviteCommand,
  unInviteCommand: UnInviteCommand,
  muteCommand: MuteCommand,
  unMuteCommand: UnMuteCommand,
  banCommand: BanCommand,
  unBanCommand: UnBanCommand,
  opCommand: OpCommand,
  deOpCommand: DeOpCommand,
): Map<string, Command> => {
  const commandMap = new Map<string, Command>();

  commandMap.set('kick', kickCommand);
  commandMap.set('invite', inviteCommand);
  commandMap.set('unmute', unMuteCommand);
  commandMap.set('mute', muteCommand);
  commandMap.set('uninvite', unInviteCommand);
  commandMap.set('ban', banCommand);
  commandMap.set('unban', unBanCommand);
  commandMap.set('op', opCommand);
  commandMap.set('deop', deOpCommand);

  return commandMap;
};

export const CommandMapProvider: Provider = {
  provide: 'COMMAND_MAP',
  useFactory: commandMapFactory,
  inject: [
    /* Services */
    ChannelService,
    UserService,
    MuteUserService,
    ChatGateway,
    /* Commands */
    KickCommand,
    InviteCommand,
    UnInviteCommand,
    MuteCommand,
    UnMuteCommand,
    BanCommand,
    UnBanCommand,
    OpCommand,
    DeOpCommand,
  ],
};
