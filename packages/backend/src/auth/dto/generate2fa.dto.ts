// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third party imports
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratedTwoFactorAuth {
  @ApiProperty({
    description: 'The QrCode on base64',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  qrCode: string;

  @ApiProperty({
    description: 'The manual entry key',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  manualEntryKey: string;
}

