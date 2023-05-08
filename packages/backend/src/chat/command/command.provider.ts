// NestJS imports
import { Provider } from '@nestjs/common';

// Local imports
import { LobbyManager } from 'src/game/lobby/lobby.manager';
import { UserService } from 'src/user/services/user.service';
import { ChatGateway } from '../chat.gateway';
import { ChannelService } from '../services/channel.service';
import { MuteUserService } from '../services/mute-user.service';
import { Command } from './command.interface';
import BanCommand from './commands/ban.command';
import DeOpCommand from './commands/deop.command';
import HelpCommand from './commands/help.command';
import InviteCommand from './commands/invite.command';
import KickCommand from './commands/kick.command';
import MuteCommand from './commands/mute.command';
import OpCommand from './commands/op.command';
import PongCommand from './commands/pong.command';
import UnBanCommand from './commands/unban.command';
import UnInviteCommand from './commands/uninvite.command';
import UnMuteCommand from './commands/unmute.command';

const commandMapFactory = (
  channelService: ChannelService,
  userService: UserService,
  muteUserService: MuteUserService,
  chatGateway: ChatGateway,
  lobbyManager: LobbyManager,
  kickCommand: KickCommand,
  inviteCommand: InviteCommand,
  unInviteCommand: UnInviteCommand,
  muteCommand: MuteCommand,
  unMuteCommand: UnMuteCommand,
  banCommand: BanCommand,
  unBanCommand: UnBanCommand,
  opCommand: OpCommand,
  deOpCommand: DeOpCommand,
  helpCommand: HelpCommand,
  pongCommand: PongCommand,
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
  commandMap.set('help', helpCommand);
  commandMap.set('pong', pongCommand);

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
    LobbyManager,
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
    HelpCommand,
    PongCommand,
  ],
};
