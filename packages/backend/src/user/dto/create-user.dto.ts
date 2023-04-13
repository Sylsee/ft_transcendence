// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

// Local imports
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { AuthProvider } from '../../auth/enum/auth-provider.enum';

export class CreateUserDto {
  @ApiProperty({
    enum: AuthProvider,
    isArray: true,
    description: 'Authentication provider',
    example: AuthProvider.GOOGLE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiProperty({
    description: 'Provider ID from the authentication provider',
    example: '1234567890',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  providerId: string;

  @ApiProperty({
    description: 'User email address',
    example: 'example@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.png',
    required: true,
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
