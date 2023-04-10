// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

// Local imports
import { FriendRequestStatus } from '../enum/friend_request-status.enum';

export class FriendRequestDto {
  @ApiProperty({
    description: 'Friend request id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    enum: FriendRequestStatus,
    isArray: true,
    description:
      'Indicates whether the requests status',
    example: FriendRequestStatus.approved,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
