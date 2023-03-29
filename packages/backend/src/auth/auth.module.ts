// NestJS imports
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Local imports
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuth42Strategy } from './strategy/42.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './strategy/google.strategy';

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
  providers: [AuthService, OAuth42Strategy, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
