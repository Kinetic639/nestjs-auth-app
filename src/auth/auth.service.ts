import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/auth/jwt/jwt-payload';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  async signUp(authCreateUserDto: AuthCreateUserDto): Promise<any> {
    const { email, firstName, lastName, password } = authCreateUserDto;
    const user = new User();

    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(password, saltOrRounds);

    try {
      await user.save();
      return this.userService.filterUsersData(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async logIn(req: AuthLoginUserDto, res: Response): Promise<any> {
    const { email, password } = req;
    try {
      const user = await User.findOne({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = {
          id: user.id,
          email,
          role: user.role,
        };

        const accessToken: string = this.jwtService.sign(payload);
        return res
          .cookie('jwt', accessToken, {
            secure: this.configService.get('COOKIE_SECURE'),
            domain: this.configService.get('COOKIE_DOMAIN'),
            httpOnly: this.configService.get('COOKIE_HTTPONLY'),
            maxAge: this.configService.get('COOKIE_MAX_AGE'),
          })
          .json(this.userService.filterUsersData(user));
      } else {
        throw new UnauthorizedException('Incorrect email or password');
      }
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  logOut(user: User, res: Response) {
    try {
      res.clearCookie('jwt', {
        secure: this.configService.get('COOKIE_SECURE'),
        domain: this.configService.get('COOKIE_DOMAIN'),
        httpOnly: this.configService.get('COOKIE_HTTPONLY'),
        maxAge: 0,
      });
      return res.json({ ok: true });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  validate(req: Request, res: Response) {
    console.log(req);
    //   try {
    //     return res.json(this.userService.filterUsersData(user));
    //   } catch (e) {
    //     throw new InternalServerErrorException(e.message);
    //   }
  }
}
