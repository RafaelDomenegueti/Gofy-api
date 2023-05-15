import { IsEmail, IsNotEmpty, Length, IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @Length(3, 255)
  name: string;

  @IsEmail()
  @Length(3, 255)
  email: string;

  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
