import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as session from 'express-session';
import helmet from 'helmet';

import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule);

  // Configure logger (see https://docs.nestjs.com/techniques/logger)
  // app.useLogger(app.get(Logger));

  // Configure Swagger (see https://docs.nestjs.com/openapi/introduction)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setVersion('0.5')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  console.log('Swagger configured.');

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
  await app.listen(process.env.BACKEND_PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // Configure hot reloading for development (see https://docs.nestjs.com/techniques/hot-reload)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    console.log('Hot Module Replacement enabled.');
  }
}
bootstrap();
