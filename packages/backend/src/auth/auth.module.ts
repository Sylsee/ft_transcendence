import { /*forwardRef,*/ Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { UsersModule } from '../users/users.module';
import { FtStrategy } from './strategy/ft.strategy';
// import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: 'secretKey',
    //   signOptions: { expiresIn: '7d' },
    // }),
    // forwardRef(() => UsersModule),
  ],
  providers: [FtStrategy /*, JwtStrategy*/],
})
export class AuthModule {}
