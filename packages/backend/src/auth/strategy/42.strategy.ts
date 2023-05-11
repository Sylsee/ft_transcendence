// NestJS imports
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

// Third-party imports
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';

// Local imports
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../enum/auth-provider.enum';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, '42') {
  private readonly logger: Logger = new Logger(OAuth42Strategy.name);

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: configService.get<string>('FORTYTWO_UID'),
        redirect_uri: configService.get<string>('FORTYTWO_CALLBACK_URL'),
        response_type: 'code',
        scope: 'public',
      })}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get<string>('FORTYTWO_UID'),
      clientSecret: configService.get<string>('FORTYTWO_SECRET'),
      callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
      scope: 'public',
    });
  }

  async validate(
    _accessToken: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _refreshToken: string,
  ): Promise<{ user: UserDto; new: boolean } | undefined> {
    // Fetch user data from 42's API
    const response = await lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${_accessToken}`,
        },
      }),
    );
    if (!response || !response.data) {
      this.logger.warn("Failed to fetch user data via 42's API");
      throw new InternalServerErrorException();
    }

    // Validate user data using class-validator
    const userDto: CreateUserDto = plainToInstance(CreateUserDto, {
      provider: AuthProvider.FORTYTWO,
      providerId: response.data.id.toString(),
      email: response.data.email,
      name: response.data.usual_first_name || response.data.first_name,
      profilePictureUrl: response.data.image?.versions?.medium,
    });

    // Create user if not exists
    try {
      await validateOrReject(userDto);

      const user = await this.authService.findOrCreateUser(userDto);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }
}
