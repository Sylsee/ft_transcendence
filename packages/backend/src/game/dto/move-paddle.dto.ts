// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEnum, IsNotEmpty } from 'class-validator';

// Local imports
import { PaddleDirection } from '../enum/paddle-direction.enum';

export class MovePaddleDto {
  @ApiProperty({
    type: 'enum',
    isArray: false,
    description: 'The direction to move the paddle',
    example: PaddleDirection.UP,
    enum: PaddleDirection,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PaddleDirection)
  direction: PaddleDirection;
}
