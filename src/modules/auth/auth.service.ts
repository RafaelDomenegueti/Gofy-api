import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import { ENV } from 'src/utils/env';
import bcrypt from 'bcrypt';
import UserRepository from 'src/shared/repositories/user/user.repository';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from 'src/modules/auth/schema/register.schema';
import { LoginAuthDto } from 'src/modules/auth/schema/login.schema';

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
    // Validation
    if (!loginAuthDto.email) {
      throw new AppError('Email is required');
    }
    if (!loginAuthDto.password) {
      throw new AppError('Password is required');
    }

    const user = await this.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );

    if (!user) {
      throw new AppError('User not found');
    }

    // Create token
    const token = this.makeToken(user.id, user.email);

    const refreshToken = this.makeRefreshToken(user.id, user.email);

    // Return user props
    return { token, refreshToken };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    // Validation
    if (!registerAuthDto.name) {
      throw new AppError('Name is required');
    }
    if (!registerAuthDto.email) {
      throw new AppError('Email is required');
    }
    if (!registerAuthDto.password) {
      throw new AppError('Password is required');
    }

    // check if user already exist
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

    // Create token
    const token = this.makeToken(user.id, user.email);

    const refreshToken = this.makeRefreshToken(user.id, user.email);

    return {
      token,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: ENV.TOKEN_RESET_KEY,
    });

    const newAccessToken = this.makeToken(payload.id, payload.email);

    return { token: newAccessToken };
  }
}
