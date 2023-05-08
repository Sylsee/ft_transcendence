// NestJS imports
import { Injectable } from '@nestjs/common';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { LobbyManager } from 'src/game/lobby/lobby.manager';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Command } from '../command.interface';

@Injectable()
export default class PongCommand implements Command {
  constructor(
    private userService: UserService,
    private chatGateway: ChatGateway,
    private lobbyManager: LobbyManager,
  ) {}

  async execute(
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void> {
    if (!arg) {
      throw new Error('No username provided');
    }

    const usernames = arg.split(/\s+/);
    const errors: string[] = [];

    await Promise.all(
      usernames.map(async (username) => {
        const user = await this.userService.findOneByName(username);
        if (user) {
          const error = await this.inviteUser(sender, user);
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
    sender: UserEntity,
    invitedUser: UserEntity,
  ): Promise<string | void> {
    try {
      const socketID: string = await this.userService.getSocketId(
        invitedUser.id,
      );
      if (!socketID) {
        return `User ${invitedUser.name} is not connected`;
      }

      const lobbyId: string = await this.lobbyManager.inviteToLobbyThroughChat(
        sender,
        invitedUser.id,
      );

      this.chatGateway.sendEvent(socketID, ServerChatEvent.InviteToLobby, {
        lobbyId: lobbyId,
        content: `${sender.name} invited you to play a pong game`,
      });

      this.chatGateway.sendEvent(sender, ServerChatEvent.Notification, {
        content: `You invited ${invitedUser.name} to play a pong game`,
      });
    } catch (error) {
      return error.message;
    }
  }
}
