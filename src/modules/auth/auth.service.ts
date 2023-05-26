import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ENV } from 'src/utils/env';
import { RegisterAuthDto } from './dto/register-auth.dto';
import bcrypt from 'bcrypt';
import UserRepository from 'src/shared/repositories/user/user.repository';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  makeToken(id: string, email: string) {
    return jwt.sign({ id, email }, ENV.TOKEN_KEY, { expiresIn: '2h' });
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

    // Return user props
    return { token };
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

    return {
      token,
    };
  }
}
