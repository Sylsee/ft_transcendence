// NestJS imports
import { Logger, UsePipes } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// Third-party imports
import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';

// Local imports
import { AuthService } from 'src/auth/auth.service';
import { WsValidationPipe } from 'src/shared/ws.validation-pipe';
import { UserService } from 'src/user/services/user.service';
import { InviteToLobbyDto } from './dto/invite-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { MovePaddleDto } from './dto/move-paddle.dto';
import { ClientGameEvent } from './enum/client-game-event.enum';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket } from './types/AuthenticatedSocket';

@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: 'http://localhost:4000',
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(GameGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(
    private authService: AuthService,
    private lobbyManager: LobbyManager,
    private userService: UserService,
  ) {}

  async afterInit(server: Server): Promise<void> {
    // Pass server instance to lobby manager
    this.lobbyManager.server = server;

    this.logger.log('Initializing socket.io server at /game');
  }

  async handleConnection(client: Socket): Promise<void> {
    let token: string;
    if (client.handshake.headers.cookie) {
      const cookies = cookie.parse(client.handshake.headers.cookie);
      token = cookies['access_token'];
    } else {
      token = client.handshake.headers.authorization?.split(' ')[1];
    }

    if (!token) {
      client.emit('exception', {
        status: 'error',
        message: 'JWT not provided',
      });
      client.disconnect();
      return;
    }

    try {
      const user = await this.authService.verify(token);
      client.data.id = user.id;

      if ((await this.userService.getSocketId(user.id)) === undefined) {
        throw new Error('Client is not connected to the chat socket.io server');
      }

      this.logger.verbose(
        `User ${user.id} connected with socket ${client.id} to namespace ${client.nsp.name}`,
      );
    } catch (error) {
      client.emit('exception', {
        status: 'error',
        message: error.message,
      });

      this.logger.warn(
        `Unable to connect client with id ${client.id} to namespace ${client.nsp.name}`,
      );

      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    try {
      // Remove player from queue and lobby
      this.lobbyManager.removePlayerFromQueue(client);
      this.lobbyManager.leaveLobby(client);

      this.logger.verbose(
        `User ${client.data.id} disconnected with socket ${client.id} from namespace ${client.nsp.name}`,
      );
    } catch (error) {
      this.logger.warn(
        `Unable to correctly disconnect client with id: ${client.id}`,
      );
      this.logger.error(error);
    }
  }

  // ---------------------------- Events ----------------------------

  @SubscribeMessage(ClientGameEvent.SearchGame)
  async handleSearchGame(client: AuthenticatedSocket): Promise<void> {
    await this.lobbyManager.addPlayerToQueue(client);
  }

  @SubscribeMessage(ClientGameEvent.CancelSearchGame)
  async handleCancelSearchGame(client: AuthenticatedSocket): Promise<void> {
    await this.lobbyManager.removePlayerFromQueueOrThrow(client);
  }

  @SubscribeMessage(ClientGameEvent.CreateLobby)
  async handleCreateLobby(client: AuthenticatedSocket): Promise<void> {
    await this.lobbyManager.createLobby(client);
  }

  @SubscribeMessage(ClientGameEvent.JoinLobby)
  async handleJoinLobby(
    client: AuthenticatedSocket,
    data: JoinLobbyDto,
  ): Promise<void> {
    await this.lobbyManager.joinLobby(client, data);
  }

  @SubscribeMessage(ClientGameEvent.LeaveLobby)
  async handleLeaveLobby(client: AuthenticatedSocket): Promise<void> {
    await this.lobbyManager.leaveLobbyOrThrow(client);
  }

  @SubscribeMessage(ClientGameEvent.InviteToLobby)
  async handleInviteToLobby(
    client: AuthenticatedSocket,
    data: InviteToLobbyDto,
  ): Promise<void> {
    await this.lobbyManager.inviteToLobby(client, data);
  }

  @SubscribeMessage(ClientGameEvent.Ready)
  async handleReady(client: AuthenticatedSocket): Promise<void> {
    await this.lobbyManager.setReady(client, true);
  }

  @SubscribeMessage(ClientGameEvent.Unready)
  async handleUnready(client: AuthenticatedSocket): Promise<void> {
    await this.lobbyManager.setReady(client, false);
  }

  // ---------------------------- Game Actions ----------------------------

  @SubscribeMessage(ClientGameEvent.MovePaddle)
  async handleMove(
    client: AuthenticatedSocket,
    data: MovePaddleDto,
  ): Promise<void> {
    await this.lobbyManager.movePaddle(client, data);
  }

  // ---------------------------- Helpers ----------------------------

  async disconnectAuthenticatedSocket(id: string): Promise<void> {
    const socket = await this.findAuthenticatedSocket(id);
    if (!socket) {
      return;
    }

    socket.disconnect();
  }

  async findAuthenticatedSocket(id: string): Promise<any | undefined> {
    const sockets = await this.server.fetchSockets();
    return sockets.find((socket) => socket.data.id === id);
  }
}
