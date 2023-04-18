// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateFriendRequestDto {
  @ApiProperty({
    description: 'The status of the friend request',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
