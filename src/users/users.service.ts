import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserFiltered } from '../types';

@Injectable()
export class UsersService {
  filterUsersData(user: User): UserFiltered {
    const { id, email, firstName, lastName, role } = user;
    return { id, email, firstName, lastName, role };
  }

  async findUserByEmail(email: string): Promise<UserFiltered | null> {
    const user = await User.findOne({ where: { email } });
    return this.filterUsersData(user);
  }
}
