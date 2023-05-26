import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      const login = await this.authService.login(loginAuthDto);

      return login;
    } catch (error) {
      throw error;
    }
  }

  @Post('/register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    try {
      const register = await this.authService.register(registerAuthDto);

      return register;
    } catch (error) {
      throw error;
    }
  }
}
