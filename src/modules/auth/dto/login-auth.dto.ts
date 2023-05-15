import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @Length(3, 255)
  email: string;

  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
