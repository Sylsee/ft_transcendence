import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from 'src/to delete users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthStrategy } from './strategy/oauth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
