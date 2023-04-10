// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FriendRequestStatus } from '../enum/friend_request-status.enum';

export class UpdateFriendRequestDto {
  @ApiProperty({
    description: 'The new status of the friend request',
    example: true,
  })
  @IsNotEmpty()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
