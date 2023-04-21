// NestJS imports
import { Injectable, Logger, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Third-party imports
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// Local imports
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async findOrCreateUser(profile: CreateUserDto): Promise<any | undefined> {
    const userExists = await this.userService.findUserByProviderIDAndProvider(
      profile.providerId,
      profile.provider,
    );

    if (!userExists) {
      const user = await this.userService.create(profile);
      return { ...user, new: true };
    }

    return { ...userExists, new: false };
  }

  async signIn(@Res() res: Response, user): Promise<void> {
    const access_token = await this.jwtService.sign({ sub: user.id });

    res.cookie('access_token', access_token, {
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 60 * 1000, // minutes to milliseconds
      // TODO: Make the cookie settings
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // domain:
      //   this.configService.get<string>('NODE_ENV') === 'production'
      //     ? '.localhost'
      //     : undefined,
      // path: '/',
    });

    res.redirect(
      `${this.configService.get<string>('APP_DOMAIN')}/callback${
        user.new ? '?new=true' : ''
      }`,
    );
  }

  verify(token: string): string {
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error);
    }
  }
}
