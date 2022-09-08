import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { MailService } from '../mail/mail.service';

interface Activate {
  password: string;
  rePassword: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async setPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async signUp(authCreateUserDto: AuthCreateUserDto): Promise<any> {
    const { email, firstName, lastName, password } = authCreateUserDto;
    const user = new User();

    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;

    user.password = await this.setPassword(password);

    try {
      await user.save();
      return this.usersService.filterUsersData(user);
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
          .json(this.usersService.filterUsersData(user));
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

  generateToken(user) {
    const payload = {
      email: user.email,
      id: user.id,
      token: user.token,
    };

    return this.jwtService.sign(payload, { expiresIn: '10h' });
  }

  async sendEmailToReset(email: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        statusCode: 404,
        message: 'Użytkownik o tym emailu nie istnieje',
      };
    }

    // if (user.active === false) {
    //   res.status(404);
    //   return {
    //     statusCode: 404,
    //     message: "Twoje konto nie zostało jeszcze aktywowane"
    //   };
    // }
    const token = this.generateToken(user);

    await this.mailService.sendMail(
      email,
      `Reset hasła do aplikacji rekrutacja MegaK`,
      `<a href="http://localhost:3000/auth/reset-password/${token}">Reset hasła</a>`,
    );

    return { statusCode: 200, message: 'Email do resetowania hasła wysłany' };
  }

  async resetPassword(email: string, data: Activate) {
    const user = await User.findOne({ where: { email } });

    if (
      !data.password ||
      !data.rePassword ||
      data.password !== data.rePassword
    ) {
      return {
        message: 'Musisz uzupełnić i powtórzyć hasło i muszą być takie same',
        statusCode: 404,
      };
    }

    // const validatePass: ValidPass = this.validatePassword(data.password);

    // if (validatePass.statusCode !== 200) {
    //   return validatePass;
    // }

    user.password = await this.setPassword(data.password);
    await user.save();

    return {
      statusCode: 202,
      message: 'Hasło zresetowane poprawnie',
    };
  }
}
