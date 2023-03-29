// NestJS imports
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

// Third-party imports
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

// Local files
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from '../auth.service';
import { AuthProvider } from '../dto/auth-provider.enum';
import { ProfileDto } from '../dto/profile.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
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
    // Validate user data using class-validator
    const profileDto = plainToInstance(ProfileDto, {
      provider: AuthProvider.GOOGLE,
      id: profile.id,
      displayName: profile.name.givenName,
      email: profile.emails[0].value,
      photoUrl: profile.photos[0].value,
    });

    // Create user if not exists
    try {
      await validateOrReject(profileDto);

      const userDto = CreateUserDto.transform(profileDto);
      await validateOrReject(userDto);

      const user = await this.authService.findOrCreateUser(userDto);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
