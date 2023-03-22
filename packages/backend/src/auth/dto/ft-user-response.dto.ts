import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class ftUserResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'id must be defined' })
  @Transform(({ obj }) => obj.id, { toClassOnly: true })
  id42: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'first_name must be defined' })
  @Transform(({ obj }) => obj.usual_first_name || obj.first_name, {
    toClassOnly: true,
  })
  name: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty({ message: 'image.link must be defined' })
  @Transform(({ obj }) => obj.image.link, { toClassOnly: true })
  avatar: string;
}
