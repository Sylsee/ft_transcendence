// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: '12345678-abcd-1234-abcd-1234567890ab',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User profile picture url',
    example: 'http://localhost:3000/uploads/profile-pictures/avatar.png',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  profilePictureUrl: string;
}
