// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The user name',
    example: 'John Doe',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
