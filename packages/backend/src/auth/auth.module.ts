import { Module } from '@nestjs/common';
import { StrategyModule } from './strategy/strategy.module';

@Module({
  imports: [StrategyModule],
})
export class AuthModule {}
