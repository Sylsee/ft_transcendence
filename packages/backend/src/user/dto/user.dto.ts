// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

// Local imports
import { UserEntity } from '../entities/user.entity';
import { UserStatus } from '../enum/user-status.enum';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User profile picture url',
    example: 'http://localhost:3000/uploads/profile-pictures/avatar.png',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  profilePictureUrl: string;

  @ApiProperty({
    type: 'enum',
    description: 'User status',
    example: UserStatus.active,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  static transform(
    user: UserEntity,
    requestUser: UserEntity = undefined,
  ): UserDto {
    const shouldIncludeStatus = (): boolean => {
      if (!requestUser) return false;

      if (user.id === requestUser.id) return true;

      const isFriendInRequestUser = requestUser.friends?.some(
        (friend) => friend.id === user.id,
      );
      if (isFriendInRequestUser) return true;

      const isFriendInUser = user.friends?.some(
        (friend) => friend.id === requestUser.id,
      );
      return isFriendInUser;
    };

    const baseDto: UserDto = {
      id: user.id,
      name: user.name,
      profilePictureUrl: user.profilePictureUrl,
    };

    if (shouldIncludeStatus()) {
      return {
        ...baseDto,
        status: user.status,
      };
    }

    return baseDto;
  }
}
