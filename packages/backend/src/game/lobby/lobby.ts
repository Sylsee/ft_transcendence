// NestJS imports
import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// Third-party imports
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { UserDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/enum/user-status.enum';
import { UserService } from 'src/user/services/user.service';
import { MAX_PLAYERS } from '../constants';
import { PowerUpDto } from '../dto/power-up.dto';
import { UserWithReadyStatusDto } from '../dto/user-with-ready-status.dto';
import { LobbyMode } from '../enum/lobby-mode.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Game } from '../game/game';
import { MatchRepository } from '../repository/match.repository';
import { AuthenticatedSocket } from '../types/AuthenticatedSocket';
import { GamePayloads } from '../types/GamePayloads';

export class Lobby {
  private readonly logger: Logger = new Logger(Lobby.name);

  public readonly id: string = v4();

  public mode = LobbyMode.QuickPlay;
  public powerUpActive = false;
  public readonly createdAt: Date = new Date();

  public readonly players: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  public readonly invitedPlayers: Array<UserEntity['id']> = new Array<
    UserEntity['id']
  >();

  public readonly instance: Game = new Game(
    this,
    this.matchRepository,
    this.userService,
  );

  constructor(
    private readonly server: Server,
    private readonly userService: UserService,
    private readonly chatGateway: ChatGateway,
    private readonly matchRepository: MatchRepository,
    mode: LobbyMode = LobbyMode.QuickPlay,
  ) {
    this.mode = mode;
  }

  public async addPlayer(client: AuthenticatedSocket): Promise<void> {
    this.players.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    this.dispatchLobbyState();

    if (
      this.players.size === MAX_PLAYERS &&
      this.instance.hasStarted === false &&
      this.mode === LobbyMode.QuickPlay
    ) {
      await this.triggerStart();
    }
  }

  public get player1(): AuthenticatedSocket {
    return Array.from(this.players.values())[0];
  }

  public get player2(): AuthenticatedSocket {
    return Array.from(this.players.values())[1];
  }

  public async removePlayer(client: AuthenticatedSocket): Promise<void> {
    if (
      this.instance.hasStarted === true &&
      this.instance.hasFinished === false
    ) {
      const loser = await this.instance.setLoser(client.data.id);

      this.dispatchToLobby<ServerGameEvents.GameMessage>(
        ServerGameEvents.GameMessage,
        {
          message: `${loser.name} give up !`,
        },
      );
    }

    this.players.delete(client.id);

    client.leave(this.id);
    client.data.lobby = null;

    const user = await this.userService.findOneById(client.data.id);
    if (!user) {
      this.logger.error(
        `User ${client.data.id} not found after authentication`,
      );
      throw new WsException('Internal server error');
    }

    if (user.status === UserStatus.InGame) {
      this.userService.update(client.data.id, { status: UserStatus.Online });

      const userWithFriends = await this.userService.findOneWithRelations(
        client.data.id,
        ['friends'],
      );
      if (!userWithFriends) {
        this.logger.error(
          `User ${client.data.id} not found after authentication`,
        );
        throw new WsException('Internal server error');
      }

      this.chatGateway.sendEvent(
        userWithFriends.friends,
        ServerChatEvent.UserStatus,
        {
          id: userWithFriends.id,
          status: UserStatus.InGame,
        },
      );
    }
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
      await this.triggerStart();
    }
  }

  public async setPowerUpActive(powerUp: PowerUpDto) {
    if (powerUp.active === this.powerUpActive) {
      return;
    }

    this.powerUpActive = powerUp.active;

    this.dispatchToLobby<ServerGameEvents.GameIsPowerUpActive>(
      ServerGameEvents.GameIsPowerUpActive,
      {
        isActive: this.powerUpActive,
      },
    );
  }

  private get readyPlayerCount(): number {
    return Array.from(this.instance.playersReady.values()).reduce<number>(
      (acc, isReady) => (isReady ? acc + 1 : acc),
      0,
    );
  }

  private async triggerStart(): Promise<void> {
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

        this.chatGateway.sendEvent(user.friends, ServerChatEvent.UserStatus, {
          id: user.id,
          status: UserStatus.InGame,
        });
      },
    );
    await Promise.all(playerPromises);

    await this.instance.triggerStart();
  }

  // -------------------- Dispatchers --------------------

  public async dispatchLobbyState(): Promise<void> {
    if (this.mode === LobbyMode.QuickPlay && this.players.size < MAX_PLAYERS) {
      return;
    }

    const players = await this.fetchUserDtoFromPlayers();
    if (players.length === 0) {
      return;
    }

    const payload: GamePayloads[ServerGameEvents.LobbyState] = {
      lobbyId: this.id,
      mode: this.mode,
      players: players,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
    };

    this.dispatchToLobby(ServerGameEvents.LobbyState, payload);
  }

  public dispatchToLobby<T extends keyof GamePayloads>(
    event: T,
    payload: GamePayloads[T],
  ): void {
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
