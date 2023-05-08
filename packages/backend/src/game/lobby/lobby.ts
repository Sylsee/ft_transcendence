// NestJS imports
import { Logger } from '@nestjs/common';

// Third-party imports
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

// Local imports
import { WsException } from '@nestjs/websockets';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { UserDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/enum/user-status.enum';
import { UserService } from 'src/user/services/user.service';
import { MAX_PLAYERS } from '../constants';
import { UserWithReadyStatusDto } from '../dto/user-with-ready-status.dto';
import { LobbyMode } from '../enum/lobby-mode.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Instance } from '../instance/instance';
import { AuthenticatedSocket } from '../types/AuthenticatedSocket';
import { GamePayloads } from '../types/GamePayloads';

export class Lobby {
  private readonly logger: Logger = new Logger(Lobby.name);

  public readonly id: string = v4();

  public mode = LobbyMode.QuickPlay;
  public readonly createdAt: Date = new Date();

  public readonly players: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  public readonly invitedPlayers: Array<UserEntity['id']> = new Array<
    UserEntity['id']
  >();

  public readonly instance: Instance = new Instance(this);

  constructor(
    private readonly server: Server,
    private readonly userService: UserService,
    private readonly chatGateway: ChatGateway,
    mode: LobbyMode = LobbyMode.QuickPlay,
  ) {
    this.mode = mode;
  }

  public addPlayer(client: AuthenticatedSocket): void {
    this.players.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    if (
      this.players.size === MAX_PLAYERS &&
      !this.instance.hasStarted &&
      this.mode === LobbyMode.QuickPlay
    ) {
      this.triggerStart();
    }

    this.dispatchLobbyState();
  }

  public removePlayer(client: AuthenticatedSocket): void {
    this.players.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    this.dispatchLobbyState();
  }

  public async setPlayerReady(
    client: AuthenticatedSocket,
    isReady: boolean,
  ): Promise<void> {
    if (this.instance.hasStarted) {
      throw new WsException('Game has already started');
    }

    const isPlayerReadyExists = this.instance.playersReady.get(client.data.id);
    if (isPlayerReadyExists === isReady) {
      throw new WsException(
        `Player is already ${isReady ? 'ready' : 'not ready'}}`,
      );
    }

    this.instance.playersReady.set(client.data.id, isReady);

    this.dispatchLobbyState();

    if (this.readyPlayerCount === MAX_PLAYERS) {
      this.triggerStart();
    }
  }

  private get readyPlayerCount(): number {
    return Array.from(this.instance.playersReady.values()).reduce<number>(
      (acc, isReady) => (isReady ? acc + 1 : acc),
      0,
    );
  }

  private async triggerStart(): Promise<void> {
    this.logger.debug(
      `triggerStart(): ${JSON.stringify(this.players.values(), null, 2)}`,
    );
    const playerPromises = Array.from(this.players.values()).map(
      async (client) => {
        this.userService.update(client.data.id, { status: UserStatus.InGame });

        const user = await this.userService.findOneWithRelations(
          client.data.id,
          ['friends'],
        );
        if (!user) {
          this.logger.error(
            `User ${client.data.id} not found after authentication`,
          );
          throw new WsException('Internal server error');
        }

        this.logger.debug(`User: ${JSON.stringify(user, null, 2)}`);

        this.chatGateway.sendEvent(user.friends, ServerChatEvent.UserStatus, {
          id: user.id,
          status: user.status,
        });
      },
    );
    await Promise.all(playerPromises);

    this.instance.triggerStart();
  }

  // -------------------- Dispatchers --------------------

  public async dispatchLobbyState(): Promise<void> {
    const players = await this.fetchUserDtoFromPlayers();

    // TODO: If spectators maybe send the lobby state anyway ?
    if (players.length === 0) {
      return;
    }

    const payload: GamePayloads[ServerGameEvents.LobbyState] = {
      lobbyId: this.id,
      players: players,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      currentRound: this.instance.currentRound,
      scores: this.instance.scores,
    };

    this.dispatchToLobby(ServerGameEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerGameEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }

  // -------------------- Helpers --------------------

  private async fetchUserDtoFromPlayers(): Promise<UserWithReadyStatusDto[]> {
    const playersPromises = Array.from(this.players.values()).map(
      async (player) => {
        const user = await this.userService.findOneById(player.data.id);
        if (!user) {
          return null;
        }
        const userDto = UserDto.transform(user) as UserWithReadyStatusDto;
        userDto.isReady = this.instance.playersReady.get(user.id) ?? false;
        return userDto;
      },
    );

    const playersResults = await Promise.all(playersPromises);

    return playersResults.filter(
      (player): player is UserWithReadyStatusDto => !!player,
    );
  }
}
