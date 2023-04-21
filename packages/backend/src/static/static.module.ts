// NestJS imports
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

// Third-party imports
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public',
    }),
  ],
})
export class StaticModule {}
