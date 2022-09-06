import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCreateUserDto {
  @IsString()
  @IsEmail({
    message: 'Valid email is required',
  })
  email: string;

  @IsString()
  @MinLength(1, {
    message: 'First name is required',
  })
  firstName: string;

  @IsString()
  @MinLength(1, {
    message: 'Last name is required',
  })
  lastName: string;

  @IsString()
  @MinLength(8, {
    message: 'Passwords must be longer than or equal to 8 characters',
  })
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords must contain at least 1 upper and 1 lower case and at least 1 number or special character',
  })
  password: string;
}
