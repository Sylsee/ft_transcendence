import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsUrl, IsEnum } from 'class-validator';
import { AuthProvider } from './auth-provider.enum';

export class ProfileDto {
  @ApiProperty({ enum: AuthProvider, description: 'Authentication provider' })
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiProperty({ description: 'Profile ID from Google' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'User display name' })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({ description: 'User email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User avatar URL' })
  @IsNotEmpty()
  @IsUrl()
  photoUrl: string;
}
