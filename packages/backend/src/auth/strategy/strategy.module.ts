import { Module } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

//connect to the 42 API using the passport-42 package
export class StrategyModule extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: '42_CLIENT_ID',
      clientSecret: '42_CLIENT_SECRET',
      callbackURL: 'http://localhost:4000/auth/signin',
      scope: 'public',
    });
  }
}
