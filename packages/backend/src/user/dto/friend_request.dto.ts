// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// Local imports
import { FriendRequestStatus } from '../enum/friend_request-status.enum';

export class FriendRequestDto {
  @ApiProperty({
    description: 'Friend request id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description:
      'Indicates whether the requests status',
    example: true,
    required: true,
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  status: FriendRequestStatus;
}
