import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { JwtPayload } from '../types/auth/jwt-payload';
import { User } from '../users/user.entity';

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: jwtConstants.secret,
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
