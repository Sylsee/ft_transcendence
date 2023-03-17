import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @ValidateIf((o) => o.name || !o.description)
  name: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((o) => !o.name || o.description)
  description: string;
}
