// NestJS imports
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Third-party imports
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Local imports
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

const logger: Logger = new Logger('ProfilePicture');

export function getProfilePictureUrlByDto(userDto: CreateUserDto): string {
  return (
    userDto.profilePictureUrl ||
    `https://ui-avatars.com/api/?background=random&size=128&length=1&bold=true&font-size=0.6&format=png&name=${userDto.name}`
  );
}

export function getProfilePictureUrl(
  filename: string,
  configService = new ConfigService(),
): string {
  return `http://localhost:${configService.get(
    'PORT',
  )}/uploads/profile-pictures/${filename}`;
}

export function getProfilePicturePath(filename: string): string {
  return join(__dirname, '..', '..', 'uploads', 'profile-pictures', filename);
}

export async function downloadProfilePicture(
  user: UserEntity,
  userDto: CreateUserDto,
  userService: UserService,
): Promise<void> {
  try {
    const response = await axios.get(userDto.profilePictureUrl, {
      responseType: 'arraybuffer',
    });

    // Check if the response is a valid profile picture type
    if (!isValidProfilePictureType(response.headers['content-type'])) {
      // Get the new profile picture url with the ui-avatars api
      const oldProfilePictureUrl = user.profilePictureUrl;
      userDto.profilePictureUrl = null;
      userDto.profilePictureUrl = getProfilePictureUrlByDto(userDto);

      if (oldProfilePictureUrl === userDto.profilePictureUrl) {
        throw new InternalServerErrorException(
          'The profile picture url is not valid',
        );
      }

      await downloadProfilePicture(user, userDto, userService);
      return;
    }

    const fileName = user.id;
    const filePath = getProfilePicturePath(fileName);

    await writeFile(filePath, response.data);

    if (filePath) {
      user.profilePictureUrl = getProfilePictureUrl(fileName);
      await userService.save(user);
    }
  } catch (err) {
    logger.error(err);
    throw new InternalServerErrorException('Error downloading profile picture');
  }
}

export function isValidProfilePictureType(contentType: string): boolean {
  const validContentTypes = new Set(['jpg', 'jpeg', 'png', 'gif']);
  return Array.from(validContentTypes).some((type) =>
    contentType.includes(type),
  );
}
