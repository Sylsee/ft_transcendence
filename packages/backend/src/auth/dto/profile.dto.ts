import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsUrl } from 'class-validator';

export class ProfileDto {
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
