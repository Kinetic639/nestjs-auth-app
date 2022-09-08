import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { MailModule } from '../mail/mail.module';
import { JwtResetPasswordStrategy } from './passport-strategy/reset-password.strategy';

@Module({
  imports: [
    forwardRef(() => PassportModule.register({ defaultStrategy: 'jwt' })),
    forwardRef(() => ConfigModule),
    forwardRef(() => JwtModule.registerAsync(jwtConfig)),
    forwardRef(() => MailModule),
  ],
  providers: [AuthService, JwtStrategy, JwtResetPasswordStrategy, UsersService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
