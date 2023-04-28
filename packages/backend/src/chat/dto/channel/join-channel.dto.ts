// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsOptional, IsString, Length } from 'class-validator';

export class JoinChannelDto {
  @ApiProperty({
    description: 'The password of the channel',
    required: false,
  })
  @IsOptional()
  @Length(5, 40)
  @IsString()
  password?: string;
}
