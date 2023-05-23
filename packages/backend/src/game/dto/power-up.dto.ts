// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PowerUpDto {
  @ApiProperty({
    description: 'Whether the power-up is active',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
