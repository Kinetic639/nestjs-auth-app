import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFiltered } from '../types';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(@Inject(UsersService) private userService: UsersService) {}

  @Get('/')
  async users() {
    return 'test';
  }

  @Get('/:email')
  async findUserByEmail(
    @Param('email') email: string,
    @GetUser() user: User,
  ): Promise<UserFiltered | null> {
    console.log(user);
    return this.userService.findUserByEmail(email);
  }
}
