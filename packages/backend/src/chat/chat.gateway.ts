// NestJS imports
import { Inject, Logger, forwardRef } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';

// Local imports
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/enum/user-status.enum';
import { UserService } from 'src/user/user.service';
import { CreateMessageDto } from './dto/message/create-message.dto';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelType } from './enum/channel-type.enum';
import { ChatEvent } from './enum/chat-event.enum';
import { ChannelService } from './services/channel.service';
import { ChatService } from './services/chat.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async afterInit(): Promise<void> {
    this.logger.log('Initializing socket.io server at /chat');
  }

  // TODO: send to friends user status
  async handleConnection(client: Socket): Promise<void> {
    const authHeader = client.handshake.headers.authorization as string;
    if (!authHeader) {
      throw new WsException('JWT not provided');
    }

    const [, token] = authHeader.split(' '); // [Bearer, token]

    try {
      const userId = this.authService.verify(token);
      client.data = { userId };

      this.userService.setSocketUser(client.id, userId);
      this.userService.setUserStatus(userId, UserStatus.active);

      this.logger.verbose(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      client.disconnect();

      this.logger.warn(`Unable to verify token: ${token}`);
      this.logger.error(error);

      throw new WsException('Invalid token' + error.message);
    }
  }

  // TODO: send to friends user status
  handleDisconnect(client: Socket): void {
    const { userId } = client.data;

    this.userService.removeSocketUser(client.id);
    this.userService.setUserStatus(userId, UserStatus.inactive);

    this.logger.verbose(`User ${userId} disconnected with socket ${client.id}`);
  }

  // ---------------------------- Events ----------------------------

  @SubscribeMessage('send:message')
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

    const isSenderInChannel = this.channelService.userIdInList(
      channel.users,
      sender.id,
    );
    if (!isSenderInChannel) {
      throw new WsException('Sender not in channel');
    }

    const commandArgs = this.chatService.parseCommand(messageDto.content);

    if (commandArgs) {
      await this.chatService.executeCommand(
        this.server,
        sender,
        channel,
        commandArgs,
      );
    } else {
      await this.chatService.handleRegularMessage(
        this.server,
        sender,
        channel,
        messageDto.content,
      );
    }

    return;
  }

  // ---------------------------- Utils ----------------------------

  async sendChannelAvailablity(
    channelEntity: ChannelEntity,
    newChannel = false,
  ): Promise<void> {
    switch (channelEntity.type) {
      case ChannelType.DIRECT_MESSAGE:
        await this.chatService.handleDirectMessageChannel(
          this.server,
          channelEntity,
        );
        break;
      case ChannelType.PUBLIC:
      case ChannelType.PASSWORD_PROTECTED:
        await this.chatService.handlePublicOrPasswordProtectedChannel(
          this.server,
          channelEntity,
        );
        break;
      case ChannelType.PRIVATE:
        await this.chatService.handlePrivateChannel(
          this.server,
          channelEntity,
          newChannel,
        );
        break;
    }
  }

  async sendChannelUnavailability(channelEntity: ChannelEntity): Promise<void> {
    // Public and password protected channels are available for everyone
    if (
      channelEntity.type === ChannelType.PUBLIC ||
      channelEntity.type === ChannelType.PASSWORD_PROTECTED
    ) {
      const usersIds: Set<string> = new Set(
        channelEntity.banUsers?.map((user) => user.id),
      );
      const socketsIds: string[] = [];
      this.userService.getSocketMap().forEach((value, key) => {
        if (!usersIds.has(value)) {
          socketsIds.push(key);
        }
      });

      this.chatService.sendEvent(
        this.server,
        socketsIds,
        ChatEvent.CHANNEL_UNAVAILABILITY,
        { channelID: channelEntity.id },
      );
    }

    // Private channels are available only for users who are in the channel or invited
    if (
      channelEntity.type === ChannelType.PRIVATE ||
      channelEntity.type === ChannelType.DIRECT_MESSAGE
    ) {
      const users = [
        ...(channelEntity.users ?? []),
        ...(channelEntity.invitedUsers ?? []),
      ];
      this.chatService.sendEvent(
        this.server,
        users,
        ChatEvent.CHANNEL_UNAVAILABILITY,
        { channelID: channelEntity.id },
      );
    }
  }

  async sendEvent(
    user: string | UserEntity | Array<string | UserEntity>,
    event: ChatEvent,
    data: object | string,
  ): Promise<void> {
    return this.chatService.sendEvent(this.server, user, event, data);
  }
}
