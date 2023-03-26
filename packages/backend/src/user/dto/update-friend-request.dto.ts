import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateFriendRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
