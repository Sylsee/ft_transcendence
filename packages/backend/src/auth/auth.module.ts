import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from '../to delete users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthStrategy } from './strategy/oauth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuthStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
