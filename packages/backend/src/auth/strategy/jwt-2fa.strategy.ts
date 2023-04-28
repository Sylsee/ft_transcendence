// NestJS imports
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

// Third-party imports
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/user/entities/user.entity';

// Local imports
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  private readonly logger = new Logger(Jwt2faStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const extractJwtFromCookie = (req) => {
      let access_token = null;
      if (req && req.cookies) {
        access_token = req.cookies['access_token'];
      }
      return access_token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      this.logger.warn(
        `Failed to retrieve from database: user ID: ${payload.sub}`,
      );
      // I don't send any message here because I don't want to give any hint to the attacker
      throw new UnauthorizedException();
    }

    if (!user.isTwoFactorAuthEnabled) {
      return user;
    }
    if (payload.isTwoFactorAuthenticated) {
      return user;
    }
    // I don't send any message here because I don't want to give any hint to the attacker
    throw new UnauthorizedException();
  }
}
