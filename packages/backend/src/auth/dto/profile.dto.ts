// Third-party imports
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

// Local imports
import { AuthProvider } from '../enum/auth-provider.enum';

export class ProfileDto {
  @IsNotEmpty()
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUrl()
  photoUrl: string;
}
