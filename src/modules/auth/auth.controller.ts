import { Controller, Post, Body, Get, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, loginSchema } from './schema/login.schema';
import { RegisterAuthDto, registerSchema } from './schema/register.schema';
import { validate } from '../../utils/zod-validator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { RefreshTokenDto } from 'src/modules/auth/schema/refresh-token.schema';
import {
  ChangePasswordDto,
  changePasswordSchema,
} from './schema/change-password.schema';
import {
  EditProfileDto,
  editProfileSchema,
} from './schema/edit-profile.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginData: LoginAuthDto) {
    try {
      const validatedData = validate(loginSchema, loginData);
      return await this.authService.login(validatedData);
    } catch (error) {
      throw error;
    }
  }

  @Post('/register')
  async register(@Body() registerData: RegisterAuthDto) {
    try {
      const validatedData = validate(registerSchema, registerData);
      return await this.authService.register(validatedData);
    } catch (error) {
      throw error;
    }
  }

  @Post('/refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('/validate-token')
  @UseGuards(JwtAuthGuard)
  async validateToken(@User() user: any) {
    return this.authService.validateToken(user);
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @User() user: any,
    @Body() changePasswordData: ChangePasswordDto,
  ) {
    try {
      const validatedData = validate(changePasswordSchema, changePasswordData);
      return await this.authService.changePassword(user.id, validatedData);
    } catch (error) {
      throw error;
    }
  }

  @Put('/profile')
  @UseGuards(JwtAuthGuard)
  async editProfile(
    @User() user: any,
    @Body() editProfileData: EditProfileDto,
  ) {
    try {
      const validatedData = validate(editProfileSchema, editProfileData);
      return await this.authService.editProfile(user.id, validatedData);
    } catch (error) {
      throw error;
    }
  }
}
