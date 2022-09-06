import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/auth/jwt/jwt-payload';
import { User } from '../users/user.entity';
import appConfig from './config/app.config';

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: appConfig().jwtSecret,
      jwtFromRequest: cookieExtractor,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload || !payload.id) {
      throw new UnauthorizedException();
    }

    const { id } = payload;
    const user: User = await User.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
