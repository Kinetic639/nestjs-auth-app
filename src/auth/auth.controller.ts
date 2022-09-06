import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from '../users/user.entity';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthUserResponse } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() authCredentialsDto: AuthCreateUserDto,
  ): Promise<any> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  async logInUser(
    @Body() req: AuthLoginUserDto,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.logIn(req, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logOutUser(
    @GetUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.logOut(user, res);
  }

  @Get('/validate')
  async validateUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    console.log(req.cookies.jwt);
    // return this.authService.validate(req, res);
  }
}
