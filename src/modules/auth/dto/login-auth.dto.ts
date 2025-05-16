import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @Length(3, 255)
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
