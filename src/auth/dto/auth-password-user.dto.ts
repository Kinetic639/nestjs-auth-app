import { IsString, MinLength } from 'class-validator';

export class AuthPasswordUserDto {
  @IsString()
  @MinLength(8, {
    message: 'Password should be of minimum 8 characters length',
  })
  password: string;

  @IsString()
  @MinLength(8, {
    message: 'Password should be of minimum 8 characters length',
  })
  rePassword: string;
}
