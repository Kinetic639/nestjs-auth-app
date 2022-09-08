import {
  Body,
  Controller,
  Get,
  Patch,
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
import { AuthPasswordUserDto } from './dto/auth-password-user.dto';

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
    // console.log(req.cookies.jwt);
    // return this.authService.validate(req, res);
  }

  @Post('/reset')
  async sendEmailToResetPassword(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.sendEmailToReset(email);
  }

  @Patch('/reset-password')
  @UseGuards(AuthGuard('reset'))
  async resetPassword(
    @Req() { user }: { user: User },
    @Body() data: AuthPasswordUserDto,
  ): Promise<{ statusCode: number; message: string }> {
    const { email } = user;
    return this.authService.resetPassword(email, data);
  }
}
