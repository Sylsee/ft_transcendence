import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import * as session from 'express-session';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'jaimelessecrets',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Start the application by listening on a port
  await app.listen(process.env.PORT || 3000);

  // Configure hot reloading for development (see https://docs.nestjs.com/techniques/hot-reload)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
