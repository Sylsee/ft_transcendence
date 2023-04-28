// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsNotEmpty } from 'class-validator';

// Local imports
import { FriendRequestDto } from './friend_request.dto';

export class FriendRequestsDto {
  @ApiProperty({
    description: 'The received friend requests',
    required: true,
  })
  @IsNotEmpty()
  received: FriendRequestDto[];

  @ApiProperty({
    description: 'The sent friend requests',
    required: true,
  })
  @IsNotEmpty()
  sent: FriendRequestDto[];
}
