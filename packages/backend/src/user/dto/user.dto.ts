// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

// Local imports
import { UserStatus } from '../enum/user-status.enum';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The display name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The URL to the user avatar image',
    example: 'https://example.com/avatar.png',
  })
  @IsNotEmpty()
  @IsUrl()
  avatarUrl: string;
}
