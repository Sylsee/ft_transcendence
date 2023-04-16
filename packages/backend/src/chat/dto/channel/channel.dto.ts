// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';

class PermissionsDto {
  @ApiProperty({
    description: 'The user is in the channel',
    example: true,
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isMember: boolean;

  @ApiProperty({
    description: '',
    example: '',
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  canModify: boolean;

  @ApiProperty({
    description: '',
    example: '',
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  canDelete: boolean;
}

export class ChannelDto {
  @ApiProperty({
    description: 'The id of the channel',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the channel',
    example: 'channel-name',
    required: true,
  })
  @IsNotEmpty()
  @Length(3, 20)
  @IsString()
  name: string;

  @ApiProperty({
    type: 'enum',
    isArray: false,
    description: 'The type of the channel',
    example: ChannelType.PRIVATE,
    enum: ChannelType,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @ApiProperty({
    description: 'The permissions of the user in the channel',
    type: PermissionsDto,
    required: true,
  })
  @IsNotEmpty()
  permissions: PermissionsDto;

  static transform(channel: ChannelEntity, userId: string): ChannelDto {
    const isMember =
      channel.users &&
      channel.users.some((channelUser) => channelUser.id === userId);
    const isInvited =
      channel.invitedUsers &&
      channel.invitedUsers.some((invitedUser) => invitedUser.id === userId);
    const isBanned =
      channel.banUsers &&
      channel.banUsers.some((bannedUser) => bannedUser.id === userId);
    const isAdmin =
      channel.admins && channel.admins.some((admin) => admin.id === userId);
    const isOwner = channel.owner && channel.owner.id === userId;

    if (
      isBanned ||
      (!isMember && !isInvited && channel.type === ChannelType.PRIVATE)
    ) {
      return null;
    }

    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      permissions: {
        isMember,
        canModify:
          (channel.type === ChannelType.DIRECT_MESSAGE && isMember) ||
          isAdmin ||
          isOwner,
        canDelete:
          (channel.type === ChannelType.DIRECT_MESSAGE && isMember) ||
          isOwner ||
          (!channel.owner && isAdmin),
      },
    };
  }
}
