// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

// Local imports
import { ChannelType } from 'src/chat/enum/channel-type.enum';

export class CreateChannelDto {
  @ApiProperty({
    description: 'The name of the channel',
    example: 'channel-name',
    required: false,
  })
  @IsOptional()
  @Length(3, 20)
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'enum',
    description: 'The type of the channel',
    example: ChannelType.DIRECT_MESSAGE,
    enum: ChannelType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType;

  @ApiProperty({
    description: 'The other user id if the channel is a direct message',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: false,
  })
  @ValidateIf((o) => o.type === ChannelType.DIRECT_MESSAGE && !o.otherUserId)
  @IsUUID()
  otherUserId?: string;
}
