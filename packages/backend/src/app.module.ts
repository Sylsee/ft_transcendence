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
import { ConfigService as CustomConfigService } from './config/config.service';

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

        API_42_UID: Joi.string().required(),
        API_42_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: CustomConfigService,
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UserModule,
  ],
  providers: [CustomConfigService],
})
export class AppModule {}
