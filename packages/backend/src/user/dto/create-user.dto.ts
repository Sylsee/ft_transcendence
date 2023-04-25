// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

// Local imports
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
  @Transform(({ value }) => sanitizeHtml(value))
  name: string;

  @ApiProperty({
    description: 'User profile picture url',
    example:
      'http://localhost:3000/uploads/profile-pictures/profile-picture.png',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  profilePictureUrl: string;
}
