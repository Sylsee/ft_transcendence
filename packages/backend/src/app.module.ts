import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),

        PORT: Joi.number().default(3000),
        POSTGRES_PORT: Joi.number().default(5432),
        FRONTEND_PORT: Joi.number().required(),
        APP_DOMAIN: Joi.string().required(),

        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().default(20),

        API_42_UID: Joi.string().required(),
        API_42_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,

      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,

      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',

      autoLoadEntities: true,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
