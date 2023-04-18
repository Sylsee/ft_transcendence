// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

// Local imports
import { UserRelationship } from '../enum/user-relationship.enum';
import { UserStatus } from '../enum/user-status.enum';

export class UserRelationshipDto {
  @ApiProperty({
    enum: UserRelationship,
    isArray: true,
    description: 'The relationship status between two users',
    example: UserRelationship.friends,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(UserRelationship)
  status: UserRelationship;
}

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The display name of the user',
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The URL to the user avatar image',
    example: 'https://example.com/avatar.png',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  avatarUrl: string;

  @ApiProperty({
    enum: UserStatus,
    isArray: true,
    description:
      'The online status of the user (if they are friends with the current user)',
    example: UserStatus.active,
    required: false,
  })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description:
      'Indicates whether the user has two-factor authentication enabled (if the user is the current user)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;
}
