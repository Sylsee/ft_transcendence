// NestJS imports
import { ApiProperty, PickType } from '@nestjs/swagger';

// Third-party imports
import { IsEnum, IsNotEmpty } from 'class-validator';

// Local imports
import { FriendRequestStatus } from '../../enum/friend_request-status.enum';
import { UserDto } from '../user.dto';

export class FriendRequestDto extends PickType(UserDto, [
  'id',
  'name',
  'profilePictureUrl',
] as const) {
  @ApiProperty({
    enum: FriendRequestStatus,
    description: 'Indicates the status of requests',
    example: FriendRequestStatus.approved,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
