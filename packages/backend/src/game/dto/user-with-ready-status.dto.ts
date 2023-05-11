// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsBoolean, IsNotEmpty } from 'class-validator';

// Local imports
import { UserDto } from 'src/user/dto/user.dto';

export class UserWithReadyStatusDto extends UserDto {
  @ApiProperty({
    description: 'Whether or not the user is ready',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isReady: boolean;
}
