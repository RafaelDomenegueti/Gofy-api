/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import { ENV } from 'src/utils/env';
import bcrypt from 'bcrypt';
import UserRepository from 'src/shared/repositories/user/user.repository';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from 'src/modules/auth/schema/register.schema';
import { LoginAuthDto } from 'src/modules/auth/schema/login.schema';
import { RefreshTokenDto } from 'src/modules/auth/schema/refresh-token.schema';
import { ChangePasswordDto } from './schema/change-password.schema';
import { EditProfileDto } from './schema/edit-profile.schema';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  makeToken(id: string, email: string) {
    return jwt.sign({ id, email }, ENV.TOKEN_KEY, { expiresIn: '2h' });
  }

  makeRefreshToken(id: string, email: string) {
    return jwt.sign({ id, email }, ENV.TOKEN_RESET_KEY, { expiresIn: '7d' });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const { ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );

    if (!user) {
      throw new AppError('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;

    // Create token
    const token = this.makeToken(user.id, user.email);

    const refreshToken = this.makeRefreshToken(user.id, user.email);

    // Return user props
    return { token, refreshToken, user: userWithoutPassword };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const oldUser = await this.userRepository.findOne({
      email: registerAuthDto.email,
    });

    if (oldUser != null) {
      throw new AppError('User Already Exist. Please Login');
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    // Create user in our database
    const user = await this.userRepository.create({
      name: registerAuthDto.name,
      email: registerAuthDto.email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const { password, ...userWithoutPassword } = user;

    // Create token
    const token = this.makeToken(user.id, user.email);

    const refreshToken = this.makeRefreshToken(user.id, user.email);

    return {
      token,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
      secret: ENV.TOKEN_RESET_KEY,
    });

    const user = await this.userRepository.findOne({ id: payload.id });

    if (!user) {
      throw new AppError('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    const newAccessToken = this.makeToken(payload.id, payload.email);
    const newRefreshToken = this.makeRefreshToken(payload.id, payload.email);

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: userWithoutPassword,
      message: 'Tokens refreshed successfully',
    };
  }

  async validateToken(user: any) {
    const userFound = await this.userRepository.findOne({ id: user.id });

    if (!userFound) {
      throw new AppError('User not found');
    }

    const { password, ...userWithoutPassword } = userFound;

    return {
      user: userWithoutPassword,
      message: 'Token is valid',
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new AppError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect');
    }

    const encryptedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    await this.userRepository.update({
      where: { id: userId },
      data: { password: encryptedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async editProfile(userId: string, editProfileDto: EditProfileDto) {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new AppError('User not found');
    }

    // If email is being changed, check if it's already in use
    if (editProfileDto.email && editProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        email: editProfileDto.email,
      });

      if (existingUser) {
        throw new AppError('Email is already in use');
      }
    }

    await this.userRepository.update({
      where: { id: userId },
      data: editProfileDto,
    });

    const updatedUser = await this.userRepository.findOne({ id: userId });
    const { password, ...userWithoutPassword } = updatedUser;

    return {
      user: userWithoutPassword,
      message: 'Profile updated successfully',
    };
  }
}
