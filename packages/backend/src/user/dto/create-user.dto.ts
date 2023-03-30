// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsNotEmpty, IsString, IsUrl, IsEnum } from 'class-validator';
import { ProfileDto } from 'src/auth/dto/profile.dto';

// Local files
import { AuthProvider } from '../../auth/dto/auth-provider.enum';

export class CreateUserDto {
  @ApiProperty({
    enum: AuthProvider,
    isArray: true,
    description: 'Authentication provider',
    example: AuthProvider.GOOGLE,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiProperty({
    description: 'Provider ID from the authentication provider',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  providerId: string;

  @ApiProperty({
    description: 'User email address',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.png',
  })
  @IsNotEmpty()
  @IsUrl()
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
