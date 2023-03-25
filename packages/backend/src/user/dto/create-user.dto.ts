// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsNotEmpty, IsString, IsUrl, IsEnum } from 'class-validator';
import { ProfileDto } from 'src/auth/dto/profile.dto';

// Local files
import { AuthProvider } from './auth-provider.enum';

export class CreateUserDto {
  @ApiProperty({ enum: AuthProvider, description: 'Authentication provider' })
  @IsEnum(AuthProvider)
  @IsNotEmpty()
  provider: AuthProvider;

  @ApiProperty({ description: 'Provider ID from the authentication provider' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User display name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User avatar URL' })
  @IsUrl()
  @IsNotEmpty()
  avatarUrl: string;

  static transform(profile: ProfileDto): CreateUserDto {
    return {
      provider: profile.provider,
      providerId: profile.id,
      email: profile.email,
      name: profile.displayName,
      avatarUrl: profile.photoUrl,
    };
  }
}
