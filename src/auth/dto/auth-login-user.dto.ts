import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthLoginUserDto {
  @IsString()
  @IsEmail({
    message: 'Valid email is required',
  })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password should be of minimum 8 characters length',
  })
  password: string;
}
