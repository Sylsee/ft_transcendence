import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserGameStatsDto {
  @ApiProperty({
    description: 'User total matches played',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  totalMatches: number;

  @ApiProperty({
    description: 'User matches wins',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  wins: number;

  @ApiProperty({
    description: 'User matches losses',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  losses: number;

  @ApiProperty({
    description: 'User total points won',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  pointsScored: number;

  @ApiProperty({
    description: 'User total points lost',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  pointsAgainst: number;
}

