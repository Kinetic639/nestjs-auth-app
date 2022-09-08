import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { extractJwtFromQuery } from './extract-jwt-from-req-param';
import { UsersService } from '../../users/users.service';
import appConfig from '../config/app.config';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'reset',
) {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromQuery]),
      ignoreExpiration: false,
      secretOrKey: appConfig().jwtSecret,
    });
  }

  async validate(payload: {
    email: string;
    id: string;
    token: string;
    iat: number;
    exp: number;
  }) {
    const user = await this.userService.findUserByEmail(payload.email);

    if (!user.isActive) {
      throw new HttpException(
        'Twoje konto nie jest jeszcze aktywne',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }
}
