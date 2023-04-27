// NestJS imports
import { BadRequestException } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';

// Third-party imports
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', 'uploads', 'profile-pictures'),
    filename: (req, file, callback) => {
      const user = req.user as UserEntity;
      const fileName = user.id;
      callback(null, fileName);
    },
  }),

  fileFilter: (req, file, callback) => {
    const fileName = req.user.id;
    const fileExtName = extname(file.originalname);

    if (fileExtName.match(/\.(jpg|jpeg|png|gif)$/)) {
      const files = fs.readdirSync(
        join(__dirname, '..', '..', 'uploads', 'profile-pictures'),
      );
      if (files.includes(fileName)) {
        fs.unlinkSync(
          join(__dirname, '..', '..', 'uploads', 'profile-pictures', fileName),
        );
      }

      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          `Unsupported file type ${fileExtName}. Only jpg, jpeg, png and gif files are allowed.`,
        ),
        false,
      );
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};
