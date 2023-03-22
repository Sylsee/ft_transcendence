import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthStrategy } from './strategy/oauth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION_TIME') * 60,
        },
      }),
    }),
    HttpModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
