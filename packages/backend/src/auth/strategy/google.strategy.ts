// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

// Third-party imports
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

// Local imports
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../enum/auth-provider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger: Logger = new Logger(GoogleStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email', 'openid'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Get user profile picture
    const defaultPhotoUrl =
      profile.photos && profile.photos[0] ? profile.photos[0].value : null;
    const parsedUrl = defaultPhotoUrl?.replace(/=s\d+-c/, '=s400-c');

    // Validate user data using class-validator
    const userDto: CreateUserDto = plainToInstance(CreateUserDto, {
      provider: AuthProvider.GOOGLE,
      providerId: profile.id,
      email: profile.emails[0].value,
      name: profile.name?.givenName,
      profilePictureUrl: parsedUrl,
    });

    // Create user if not exists
    try {
      await validateOrReject(userDto);

      const user = await this.authService.findOrCreateUser(userDto);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
