// NestJS imports
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

// Third-party imports
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';

// Local imports
import { AuthService } from '../auth.service';
import { validateOrReject } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ProfileDto } from '../dto/profile.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthProvider } from '../dto/auth-provider.enum';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, '42') {
  private readonly logger = new Logger(OAuth42Strategy.name);

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
    _refreshToken: string,
  ): Promise<{ user: UserEntity; new: Boolean } | undefined> {
    // Fetch user data from 42's API
    const response = await lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${_accessToken}`,
        },
      }),
    );
    if (!response) {
      this.logger.warn("Failed to fetch user data via 42's API");
      throw new UnauthorizedException();
    }

    // Validate user data using class-validator
    const profileDto = plainToInstance(ProfileDto, {
      provider: AuthProvider.FORTYTWO,
      id: response.data.id.toString(),
      displayName: response.data.usual_first_name || response.data.first_name,
      email: response.data.email,
      photoUrl: response.data.image.link,
    });

    // Create user if not exists
    try {
      await validateOrReject(profileDto);

      const userDto = CreateUserDto.transform(profileDto);
      await validateOrReject(userDto);

      const user = await this.authService.findOrCreateUser(userDto);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }
}
