// NestJS imports
import { Inject, Logger, UsePipes, forwardRef } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';

// Third-party imports
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';

// Local imports
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from 'src/game/game.gateway';
import { userIdInList } from 'src/shared/list';
import { sendEvent } from 'src/shared/websocket';
import { WsValidationPipe } from 'src/shared/ws.validation-pipe';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/enum/user-status.enum';
import { UserService } from 'src/user/services/user.service';
import { CreateMessageDto } from './dto/message/create-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelType } from './enum/channel-type.enum';
import { ClientChatEvent } from './enum/client-chat-event.enum';
import { ServerChatEvent } from './enum/server-chat-event.enum';
import { ChannelService } from './services/channel.service';
import { ChatService } from './services/chat.service';

@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: 'http://localhost:4000',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    @Inject(forwardRef(() => GameGateway))
    private gameGateway: GameGateway,
  ) {}

  async afterInit(): Promise<void> {
    this.logger.log('Initializing socket.io server at /chat');
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

      this.userService.setSocketUser(client.id, user.id);

      this.logger.verbose(
        `User ${user.id} connected with socket ${client.id} to namespace ${client.nsp.name}`,
      );

      // Send user status to friends
      if (user.status === UserStatus.Offline) {
        this.userService.update(user.id, { status: UserStatus.Online });

        const userWithFriends = await this.userService.findOneWithRelations(
          user.id,
          ['friends'],
        );
        if (!userWithFriends) {
          this.logger.error('User not found after authentication');
          throw new WsException('Internal server error');
        }

        this.sendEvent(userWithFriends.friends, ServerChatEvent.UserStatus, {
          id: userWithFriends.id,
          status: UserStatus.Online,
        });
      }
    } catch (error) {
      client.emit('exception', {
        status: 'error',
        message: error.message,
      });

      this.logger.warn(`Unable to verify token: ${token}`);

      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      const userId = client.data.id;

      // Disconnect from game namespace
      this.gameGateway.disconnectAuthenticatedSocket(client.data.id);

      this.userService.removeSocketUser(client.id);

      // Update user status
      this.userService.update(userId, { status: UserStatus.Offline });

      // Send user status to friends
      const user = await this.userService.findOneWithRelations(userId, [
        'friends',
      ]);
      if (!user) {
        this.logger.error('User not found after authentication');
        return;
      }

      this.sendEvent(user.friends, ServerChatEvent.UserStatus, {
        id: user.id,
        status: UserStatus.Offline,
      });

      this.logger.verbose(
        `User ${userId} disconnected with socket ${client.id} from namespace ${client.nsp.name}`,
      );
    } catch (error) {
      this.logger.warn(`Unable to disconnect user: ${client.id}`);
    }
  }

  // ---------------------------- Events ----------------------------

  @SubscribeMessage(ClientChatEvent.Message)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ): Promise<WsResponse<any>> {
    const messageDto = plainToInstance(CreateMessageDto, payload);
    await validateOrReject(messageDto).catch((errors) => {
      throw new WsException(errors);
    });

    const sender = await this.userService.getUserBySocket(client.id);
    if (!sender) {
      throw new WsException('Sender not found');
    }

    const channel = await this.channelService.findOneByIdWithRelations(
      messageDto.channelId,
      ['owner', 'users', 'admins', 'invitedUsers', 'banUsers', 'muteUsers'],
    );
    if (!channel) {
      throw new WsException('Channel not found');
    }

    const isSenderInChannel = userIdInList(channel.users, sender.id);
    if (!isSenderInChannel) {
      throw new WsException('Sender not in channel');
    }

    const commandArgs = this.chatService.parseCommand(messageDto.content);

    if (commandArgs) {
      await this.chatService.executeCommand(sender, channel, commandArgs);
    } else {
      await this.chatService.handleRegularMessage(
        sender,
        channel,
        messageDto.content,
      );
    }

    return;
  }

  // ---------------------------- Utils ----------------------------

  async sendChannelAvailablity(
    channel: ChannelEntity,
    wasPrivate: boolean,
  ): Promise<void> {
    switch (channel.type) {
      case ChannelType.DIRECT_MESSAGE:
        await this.chatService.handleDirectMessageChannel(channel);
        break;
      case ChannelType.PUBLIC:
      case ChannelType.PASSWORD_PROTECTED:
        await this.chatService.handlePublicOrPasswordProtectedChannel(channel);
        break;
      case ChannelType.PRIVATE:
        await this.chatService.handlePrivateChannel(channel, wasPrivate);
        break;
      default:
        this.logger.warn(`Unknown channel type: ${channel.type}`);
        throw new WsException('Unknown channel type');
    }
  }

  async sendChannelUnavailability(channel: ChannelEntity): Promise<void> {
    // Public and password protected channels are available for everyone
    if (
      channel.type === ChannelType.PUBLIC ||
      channel.type === ChannelType.PASSWORD_PROTECTED
    ) {
      const usersIds: Set<string> = new Set(
        channel.banUsers?.map((user) => user.id),
      );
      const socketsIds: string[] = [];
      this.userService.getSocketMap().forEach((value, key) => {
        if (!usersIds.has(value)) {
          socketsIds.push(key);
        }
      });

      this.sendEvent(socketsIds, ServerChatEvent.ChannelUnavailable, {
        channelId: channel.id,
      });
    }

    // Private channels are available only for users who are in the channel or invited
    if (
      channel.type === ChannelType.PRIVATE ||
      channel.type === ChannelType.DIRECT_MESSAGE
    ) {
      const users = [...(channel.users ?? []), ...(channel.invitedUsers ?? [])];
      this.sendEvent(users, ServerChatEvent.ChannelUnavailable, {
        channelId: channel.id,
      });
    }
  }

  async sendEvent(
    user: string | UserEntity | Array<string | UserEntity>,
    event: ServerChatEvent,
    data: object | string,
  ): Promise<void> {
    return sendEvent(this.server, user, event, data, this.userService);
  }

  async sendChannelAvailableEvent(
    channel: ChannelEntity,
    userId: string,
    socket: string | UserEntity,
  ): Promise<void> {
    this.chatService.sendChannelAvailableEvent(channel, userId, socket);
  }
}
