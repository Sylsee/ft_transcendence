// Nest dependencies
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService as NestConfigService } from '@nestjs/config';

// Other dependencies
import * as env from 'dotenv';

// Local files
import { UserEntity } from 'src/user/entities/user.entity';

env.config();

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory {
  constructor(private nestConfigService: NestConfigService) {}

  public get(key: string): any {
    const value = this.nestConfigService.get(key);
    console.log(`ConfigService.get(${key}) = ${value}`);
    return value;
  }

  public isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),

      username: this.get('DB_USER'),
      password: this.get('DB_PASS'),
      database: this.get('DB_NAME'),

      entities: [UserEntity],
      synchronize: !this.isProduction(),

      autoLoadEntities: true,
    };
  }
}
