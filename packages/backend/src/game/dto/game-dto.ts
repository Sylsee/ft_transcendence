// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

// Local imports
import { UserDto } from 'src/user/dto/user.dto';
import { MatchEntity } from '../entity/match.entity';

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
    description: 'Match winner',
    type: UserDto,
    required: true,
  })
  @IsNotEmpty()
  winner: UserDto;

  @ApiProperty({
    description: 'Player 1',
    type: UserDto,
    required: true,
  })
  @IsNotEmpty()
  player1: UserDto;

  @ApiProperty({
    description: 'Player 2',
    type: UserDto,
    required: true,
  })
  @IsNotEmpty()
  player2: UserDto;

  @ApiProperty({
    description: 'Player 1 score',
    example: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  player1Score: number;

  @ApiProperty({
    description: 'Player 2 score',
    example: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  player2Score: number;

  static transform(match: MatchEntity): MatchDto {
    return {
      id: match.id,
      createdAt: match.createdAt,
      winner: UserDto.transform(match.winner),
      player1: UserDto.transform(match.player1),
      player2: UserDto.transform(match.player2),
      player1Score: match.player1Score,
      player2Score: match.player2Score,
    };
  }
}
