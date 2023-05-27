// NestJS imports
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WsException } from '@nestjs/websockets';

// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChatGateway } from 'src/chat/chat.gateway';
import { ServerChatEvent } from 'src/chat/enum/server-chat-event.enum';
import { userIdInList } from 'src/shared/list';
import { sendEvent } from 'src/shared/websocket';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { LOBBY_MAX_LIFETIME, MAX_PLAYERS } from '../constants';
import { InviteToLobbyDto } from '../dto/invite-lobby.dto';
import { JoinLobbyDto } from '../dto/join-lobby.dto';
import { MovePaddleDto } from '../dto/move-paddle.dto';
import { PowerUpDto } from '../dto/power-up.dto';
import { LobbyMode } from '../enum/lobby-mode.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { MatchRepository } from '../repository/match.repository';
import { AuthenticatedSocket } from '../types/AuthenticatedSocket';
import { GamePayloads } from '../types/GamePayloads';
import { Lobby } from './lobby';

@Injectable()
export class LobbyManager {
  private readonly logger: Logger = new Logger(LobbyManager.name);

  public server: Server;

  private playerQueue: Array<AuthenticatedSocket> =
    new Array<AuthenticatedSocket>();

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private userService: UserService,
    private matchRepository: MatchRepository,
  ) {}

  public async createLobby(client: AuthenticatedSocket): Promise<void> {
    if (client.data.lobby) {
      throw new WsException('You are already in a lobby, leave it first');
    }

    if (this.playerQueue.includes(client)) {
      throw new WsException('You are in queue, please leave queue first');
    }

    const newLobby = new Lobby(
      this.server,
      this.userService,
      this.chatGateway,
      this.matchRepository,
      LobbyMode.Custom,
    );
    this.lobbies.set(newLobby.id, newLobby);

    await newLobby.addPlayer(client);
  }

  public async joinLobby(
    client: AuthenticatedSocket,
    joinLobbyDto: JoinLobbyDto,
  ): Promise<void> {
    if (client.data.lobby) {
      throw new WsException('You are already in a lobby');
    }

    if (this.playerQueue.includes(client)) {
      throw new WsException('You are in queue, please leave queue first');
    }

    const lobby = this.lobbies.get(joinLobbyDto.lobbyId);
    if (!lobby) {
      throw new WsException('Lobby not found');
    }

    if (
      lobby.mode === LobbyMode.Custom &&
      !lobby.invitedPlayers.includes(client.data.id)
    ) {
      throw new WsException('You are not invited to this lobby');
    }

    if (lobby.players.size >= MAX_PLAYERS) {
      throw new WsException('Lobby already full');
    }

    if (lobby.players.has(client.id)) {
      throw new WsException('You are already in this lobby');
    }

    await lobby.addPlayer(client);
  }

  public async leaveLobbyOrThrow(client: AuthenticatedSocket): Promise<void> {
    if (!client.data.lobby) {
      throw new WsException('You are not in a lobby');
    }

    const lobby = this.lobbies.get(client.data.lobby.id);
    if (!lobby) {
      throw new WsException('Lobby not found');
    }

    if (!lobby.players.has(client.id)) {
      throw new WsException('You are not in this lobby');
    }

    await lobby.removePlayer(client);

    if (lobby.players.size === 0) {
      this.lobbies.delete(lobby.id);
    } else if (
      lobby.instance.hasStarted === true &&
      lobby.instance.hasFinished === false
    ) {
      lobby.instance.triggerFinish();
    } else if (lobby.instance.hasFinished === false) {
      lobby.instance.stop = true;
      lobby.dispatchToLobby(ServerGameEvents.GameFinish, {
        winner: null,
        player1Score: 0,
        player2Score: 0,
      });
    }
  }

  public async leaveLobby(client: AuthenticatedSocket): Promise<void> {
    if (!client.data.lobby) {
      return;
    }

    const lobby = this.lobbies.get(client.data.lobby.id);
    if (!lobby) {
      return;
    }

    if (!lobby.players.has(client.id)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await lobby.removePlayer(client).catch(() => {});

    if (lobby.players.size === 0) {
      this.lobbies.delete(lobby.id);
    } else if (
      lobby.instance.hasStarted === true &&
      lobby.instance.hasFinished === false
    ) {
      lobby.instance.triggerFinish();
    } else if (lobby.instance.hasFinished === false) {
      lobby.instance.stop = true;
      lobby.dispatchToLobby(ServerGameEvents.GameFinish, {
        winner: null,
        player1Score: 0,
        player2Score: 0,
      });
    }
  }

  public async inviteToLobby(
    client: AuthenticatedSocket,
    inviteDto: InviteToLobbyDto,
  ): Promise<void> {
    if (client.data.id === inviteDto.userId) {
      throw new WsException('You cannot invite yourself');
    }

    if (!client.data.lobby) {
      throw new WsException('You are not in a lobby');
    }

    if (client.data.lobby.players.size >= MAX_PLAYERS) {
      throw new WsException('Lobby already full');
    }

    if (client.data.lobby.players.has(inviteDto.userId)) {
      throw new WsException('User already in this lobby');
    }

    if (client.data.lobby.invitedPlayers.includes(inviteDto.userId)) {
      throw new WsException('User already invited');
    }

    const invitedUser = await this.userService.findOneWithRelations(
      inviteDto.userId,
      ['blockedUsers'],
    );
    if (!invitedUser) {
      throw new WsException('User not found');
    }

    if (userIdInList(invitedUser.blockedUsers, client.data.id)) {
      throw new WsException('You cannot invite this user');
    }

    const currentUser = await this.userService.findOneById(client.data.id);
    if (!currentUser) {
      this.logger.error(
        `User not found ${client.data.id} after authentication`,
      );
      throw new WsException('Internal server error');
    }

    client.data.lobby.invitedPlayers.push(invitedUser.id);

    this.chatGateway.sendEvent(invitedUser, ServerChatEvent.InviteToLobby, {
      lobbyId: client.data.lobby.id,
      content: `${currentUser.name} invited you to play a game of pong`,
    });
  }

  public async inviteToLobbyThroughChat(
    user: UserEntity,
    invitedUser: UserEntity,
  ): Promise<string> {
    if (user.id === invitedUser.id) {
      throw new WsException('You cannot invite yourself');
    }

    let lobby: Lobby | undefined = undefined;
    for (const currentLobby of this.lobbies.values()) {
      const users = Array.from(currentLobby.players.values());

      if (users.some((player) => player.data.id === user.id)) {
        lobby = currentLobby;
        break;
      }
    }
    if (!lobby) {
      throw new WsException('You are not in a lobby');
    }

    if (lobby.players.size >= MAX_PLAYERS) {
      throw new WsException('Lobby already full');
    }

    if (lobby.players.has(invitedUser.id)) {
      throw new WsException('User already in this lobby');
    }

    if (lobby.invitedPlayers.includes(invitedUser.id)) {
      throw new WsException('User already invited');
    }

    if (userIdInList(invitedUser.blockedUsers, user.id)) {
      throw new WsException('You cannot invite this user');
    }

    lobby.invitedPlayers.push(invitedUser.id);

    return lobby.id;
  }

  public async setReady(
    client: AuthenticatedSocket,
    ready: boolean,
  ): Promise<void> {
    if (!client.data.lobby) {
      throw new WsException('You are not in a lobby');
    }

    await client.data.lobby.setPlayerReady(client, ready);
  }

  public async setPowerUpActive(
    client: AuthenticatedSocket,
    powerUp: PowerUpDto,
  ): Promise<void> {
    if (!client.data.lobby) {
      throw new WsException('You are not in a lobby');
    }

    if (client.data.lobby.mode !== LobbyMode.Custom) {
      throw new WsException('You cannot use power ups in this lobby');
    }

    if (
      client.data.lobby.instance.hasStarted ||
      client.data.lobby.instance.hasFinished
    ) {
      throw new WsException('Game already started');
    }

    if (!client.data.lobby.players.has(client.id)) {
      throw new WsException('You are not in this lobby');
    }

    await client.data.lobby.setPowerUpActive(powerUp);
  }

  // -------------------- Lobby queue --------------------

  public async addPlayerToQueue(client: AuthenticatedSocket): Promise<void> {
    if (client.data.lobby) {
      throw new WsException('You are already in a lobby, leave it first');
    }

    if (this.playerQueue.includes(client)) {
      throw new WsException('You are already in queue');
    }

    this.playerQueue.push(client);
    this.tryToCreateLobby();
  }

  public async removePlayerFromQueueOrThrow(
    client: AuthenticatedSocket,
  ): Promise<void> {
    const index = this.playerQueue.findIndex(
      (player) => player.id === client.id,
    );
    if (index === -1) {
      throw new WsException('You are not in queue');
    }

    this.playerQueue.splice(index, 1);
  }

  public async removePlayerFromQueue(
    client: AuthenticatedSocket,
  ): Promise<void> {
    const index = this.playerQueue.findIndex(
      (player) => player.id === client.id,
    );
    if (index === -1) {
      return;
    }

    this.playerQueue.splice(index, 1);
  }

  public tryToCreateLobby(): void {
    if (this.playerQueue.length < MAX_PLAYERS) {
      return;
    }

    const lobby = new Lobby(
      this.server,
      this.userService,
      this.chatGateway,
      this.matchRepository,
    );
    this.lobbies.set(lobby.id, lobby);

    this.playerQueue.splice(0, MAX_PLAYERS).forEach(async (client) => {
      await lobby.addPlayer(client).catch((error) => {
        throw new WsException(error.message);
      });
    });
  }

  // -------------------- Game --------------------

  public movePaddle(
    client: AuthenticatedSocket,
    movePaddleDto: MovePaddleDto,
  ): void {
    if (!client.data.lobby) {
      throw new WsException('You are not in a lobby');
    }

    if (!client.data.lobby.instance || !client.data.lobby.instance.hasStarted) {
      throw new WsException('Game not started');
    }

    client.data.lobby.instance.movePaddle(client, movePaddleDto);
  }

  // -------------------- Utils --------------------

  @Cron('*/30 * * * * *')
  public async cleanUpLobbies(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerGameEvents.GameMessage>(
          ServerGameEvents.GameMessage,
          {
            message: 'Game timed out',
          },
        );

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }

  public sendEvent<T extends keyof GamePayloads>(
    sockets: string | UserEntity | Array<string | UserEntity>,
    event: T,
    data: GamePayloads[T],
  ): void {
    sendEvent(this.server, sockets, event, data, this.userService);
  }
}
