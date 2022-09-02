import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/auth/jwt-payload';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const user = new User();

    user.email = email;

    const saltOrRounds = 10;
    user.password = await bcrypt.hash(password, saltOrRounds);

    try {
      await user.save();
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async logIn(req: AuthCredentialsDto, res: Response): Promise<any> {
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
            //@TODO set Cookies setting in env variables
            secure: false,
            domain: 'localhost',
            httpOnly: true,
          })
          .json(this.userService.filterUsersData(user));
      } else {
        return res.json({ error: 'Invalid login data!' });
      }
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  logOut(user: User, res: Response) {
    try {
      res.clearCookie('jwt', {
        //@TODO set Cookies setting in env variables
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
