import { Module } from '@nestjs/common';
import { ErrorExceptionFilter } from 'src/shared/filters/error/error-exception.filter';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_FILTER } from '@nestjs/core';
import { ENV } from 'src/utils/env';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import UserRepository from 'src/shared/repositories/user/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ENV.TOKEN_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    AuthService,
    UserRepository,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [JwtModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
