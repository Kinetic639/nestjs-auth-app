import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  async logInUser(
    @Body() req: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.logIn(req, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logOutUser(@GetUser() user: User, @Res() res: Response): Promise<any> {
    return this.authService.logOut(user, res);
  }
}
