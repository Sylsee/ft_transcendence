import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class ftUserResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'id must be defined' })
  id42: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'first_name must be defined' })
  name: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty({ message: 'image.link must be defined' })
  avatar: string;

  static transform(response: any): ftUserResponseDto {
    return {
      id42: response.id,
      login: response.login,
      name: response.usual_first_name || response.first_name,
      avatar: response.image.link,
    };
  }
}
