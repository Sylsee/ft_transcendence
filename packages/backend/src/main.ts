import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as session from 'express-session';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = new Logger();
  const configService = app.get(ConfigService);

  // Configure CORS (see https://docs.nestjs.com/security/cors)
  // app.enableCors({
  // origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:4000',
  // credentials: true,
  // });

  // Use helmet (see https://docs.nestjs.com/security/helmet)
  app.use(helmet());

  // Configure express-session middleware (see https://docs.nestjs.com/techniques/session)
  app.use(
    session({
      secret:
        'bA@gxxDzA@axQ4mNYMnk@$T$T4zqD96KBRPrz4YSon?XhP4?MdTG#N8jJac$G?gpgkRH$9p66oF8tPsk',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Configure passport middleware (see https://docs.nestjs.com/security/authentication)
  app.use(passport.initialize());
  app.use(passport.session());

  // Start the application by listening on a port
  await app.listen(configService.get<number>('BACKEND_PORT') || 3000);
  logger.log(
    `Application is running on: ${await app.getUrl()}`,
    'NestApplication',
  );

  // Configure Swagger (see https://docs.nestjs.com/openapi/introduction)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setVersion('0.5')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  logger.log(
    'Swagger has been configured and is available at /swagger',
    'NestApplication',
  );

  // Configure hot reloading for development (see https://docs.nestjs.com/techniques/hot-reload)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    logger.log('Hot Module Replacement enabled', 'NestApplication');
  }
}
bootstrap();
