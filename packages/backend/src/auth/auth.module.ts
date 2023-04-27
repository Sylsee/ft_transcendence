// NestJS imports
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Local imports
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuth42Strategy } from './strategy/42.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { Jwt2faStrategy } from './strategy/jwt-2fa.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

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
  providers: [
    AuthService,
    OAuth42Strategy,
    GoogleStrategy,
    JwtStrategy,
    Jwt2faStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
