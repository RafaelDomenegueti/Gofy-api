import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, loginSchema } from './schema/login.schema';
import { RegisterAuthDto, registerSchema } from './schema/register.schema';
import { validate } from '../../utils/zod-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginData: LoginAuthDto) {
    try {
      const validatedData = validate(loginSchema, loginData);
      return await this.authService.login(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('/register')
  async register(@Body() registerData: RegisterAuthDto) {
    try {
      const validatedData = validate(registerSchema, registerData);
      return await this.authService.register(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
