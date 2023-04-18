// NestJS imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local imports
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './channel.controller';
import { ChatGateway } from './chat.gateway';
import { CommandMapProvider } from './command/command.provider';
import BanCommand from './command/commands/ban.command';
import DeOpCommand from './command/commands/deop.command';
import InviteCommand from './command/commands/invite.command';
import KickCommand from './command/commands/kick.command';
import MuteCommand from './command/commands/mute.command';
import OpCommand from './command/commands/op.command';
import UnBanCommand from './command/commands/unban.command';
import UnInviteCommand from './command/commands/uninvite.command';
import UnMuteCommand from './command/commands/unmute.command';
import { ChannelEntity } from './entities/channel.entity';
import { MessageEntity } from './entities/message.entity';
import { MuteUserEntity } from './entities/mute-user.entity';
import { ChannelRepository } from './repositories/channel.repository';
import { MessageRepository } from './repositories/message.repository';
import { MuteUserRepository } from './repositories/mute-user.repository';
import { ChannelService } from './services/channel.service';
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';
import { MuteUserService } from './services/mute-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity, MessageEntity, MuteUserEntity]),
    UserModule,
    AuthModule,
  ],
  providers: [
    /* Gateway */
    ChatGateway,
    /* Services */
    ChatService,
    MessageService,
    ChannelService,
    MuteUserService,
    /* Repositories */
    MessageRepository,
    ChannelRepository,
    MuteUserRepository,
    /* Commands */
    CommandMapProvider,
    InviteCommand,
    UnInviteCommand,
    KickCommand,
    MuteCommand,
    UnMuteCommand,
    BanCommand,
    UnBanCommand,
    OpCommand,
    DeOpCommand,
  ],
  controllers: [ChannelController],
})
export class ChatModule {}
