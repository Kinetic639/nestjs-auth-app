import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersService, User],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
