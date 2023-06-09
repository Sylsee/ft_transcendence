// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

// Local imports
import { UserDto } from 'src/user/dto/user.dto';
import { MatchEntity } from '../entity/match.entity';
import { LobbyMode } from '../enum/lobby-mode.enum';

export class MatchDto {
  @ApiProperty({
    description: 'Match id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Match created at',
    example: '2021-08-01T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    type: 'enum',
    isArray: false,
    description: 'Match mode',
    example: LobbyMode.QuickPlay,
    enum: LobbyMode,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(LobbyMode)
  mode: LobbyMode;

  @ApiProperty({
    description: 'Match winner',
    type: UserDto,
    required: true,
  })
  @IsNotEmpty()
  winner: UserDto;

  @ApiProperty({
    description: 'Match loser',
    type: UserDto,
    required: true,
  })
  @IsNotEmpty()
  loser: UserDto;

  @ApiProperty({
    description: 'Player 1 score',
    example: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  winnerPoints: number;

  @ApiProperty({
    description: 'Player 2 score',
    example: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  loserPoints: number;

  static transform(match: MatchEntity): MatchDto {
    return {
      id: match.id,
      createdAt: match.createdAt,
      mode: match.mode,
      winner: UserDto.transform(match.winner),
      loser: UserDto.transform(match.loser),
      winnerPoints: match.winnerPoints,
      loserPoints: match.loserPoints,
    };
  }
}
