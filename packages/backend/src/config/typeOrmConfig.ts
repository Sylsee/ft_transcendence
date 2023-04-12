// Nest dependencies
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// Other dependencies
import * as env from 'dotenv';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { MuteUserEntity } from 'src/chat/entities/mute-user.entity';
import { FriendRequest } from 'src/user/entities/friend_request.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserFriend } from 'src/user/entities/user_friend.entity';

env.config();

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private nestConfigService: NestConfigService) {}

  public get(key: string): any {
    return this.nestConfigService.get(key);
  }

  public isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),

      username: this.get('DB_USER'),
      password: this.get('DB_PASS'),
      database: this.get('DB_NAME'),

      entities: [
        UserEntity,
        UserFriend,
        FriendRequest,
        ChannelEntity,
        MessageEntity,
        MuteUserEntity,
      ],
      synchronize: !this.isProduction(),

      autoLoadEntities: true,
    };
  }
}
