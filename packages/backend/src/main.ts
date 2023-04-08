// NestJS imports
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Third-party imports
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';

// Local imports
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = new Logger();
  const configService = app.get(ConfigService);

  // Configure CORS (see https://docs.nestjs.com/security/cors)
  app.enableCors({
    credentials: true,
    origin:
      configService.get<string>('NODE_ENV') === 'production'
        ? configService.get<string>('APP_DOMAIN')
        : true,
  });

  // Use helmet (see https://docs.nestjs.com/security/helmet)
  app.use(helmet());

  // Use global validation pipe (see https://docs.nestjs.com/techniques/validation)
  app.useGlobalPipes(new ValidationPipe());

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

  // Configure Swagger (see https://docs.nestjs.com/openapi/introduction)
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Transcendence API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
    logger.log(
      'Swagger has been configured and is available at /swagger',
      'NestApplication',
    );
  }

  // Start the application by listening on a port
  await app.listen(configService.get<number>('BACKEND_PORT') || 3000);
  logger.log(
    `Application is running on: ${await app.getUrl()}`,
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
