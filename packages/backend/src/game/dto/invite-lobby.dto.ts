// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsNotEmpty, IsUUID } from 'class-validator';

export class InviteToLobbyDto {
  @ApiProperty({
    description: 'The ID of the user to invite',
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
