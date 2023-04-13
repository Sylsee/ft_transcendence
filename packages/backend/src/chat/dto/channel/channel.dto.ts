// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { ChannelType } from 'src/chat/enum/channel-type.enum';

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
    description: 'The user is in the channel',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isJoined?: boolean;

  static transform(channel: ChannelEntity, isJoined?: boolean): ChannelDto {
    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      ...(typeof isJoined !== 'undefined' ? { isJoined } : {}),
    };
  }
}
