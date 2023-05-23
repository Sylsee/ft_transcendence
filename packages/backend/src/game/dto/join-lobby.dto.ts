// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinLobbyDto {
  @ApiProperty({
    description: 'The ID of the lobby to join',
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID()
  lobbyId: string;
}
