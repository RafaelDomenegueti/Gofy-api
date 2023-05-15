import { IsEmail, Length } from 'class-validator';

export class ResetPasswordAuthDto {
  @IsEmail()
  @Length(3, 255)
  email: string;
}
