import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/to delete users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),

        BACKEND_PORT: Joi.number().default(3000),
        FRONTEND_PORT: Joi.number().default(4000),
        POSTGRES_PORT: Joi.number().default(5432),

        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('20m'),

        API_42_UID: Joi.string().required(),
        API_42_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
