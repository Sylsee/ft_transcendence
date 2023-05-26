// NestJS imports
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local imports
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from './chat/chat.module';
import { envValidationConfig } from './config/env-validation.config';
import { TypeOrmConfigService } from './config/type-orm.config';
import { GameModule } from './game/game.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [
    ConfigModule.forRoot(envValidationConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ChatModule,
    StaticModule,
    GameModule,
  ],
  providers: [TypeOrmConfigService],
})
export class AppModule {}
