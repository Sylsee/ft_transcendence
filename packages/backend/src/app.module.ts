// Nest dependencies
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

// Other dependencies
import * as Joi from 'joi';

// Local files
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmConfigService } from './config/typeOrmConfig';

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
        DB_PORT: Joi.number().default(5432),
        FRONTEND_PORT: Joi.number().required(),
        APP_DOMAIN: Joi.string().required(),

        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().default(20),

        FORTYTWO_UID: Joi.string().required(),
        FORTYTWO_SECRET: Joi.string().required(),
        FORTYTWO_CALLBACK_URL: Joi.string().required(),

        GOOGLE_ID: Joi.string().required(),
        GOOGLE_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UserModule,
  ],
  providers: [TypeOrmConfigService],
})
export class AppModule {}
