import { Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors/AppError';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ENV } from 'src/utils/env';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { NewPasswordAuthDto } from './dto/new-password-auth.dto';
import MailService from 'src/shared/services/sendMail/mail.service';
import bcrypt from 'bcrypt';
import UserRepository from 'src/shared/repositories/user/user.repository';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

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

  async resetPassword(resetPasswordAuthDto: ResetPasswordAuthDto) {
    if (!resetPasswordAuthDto.email) {
      throw new AppError('Email is required');
    }

    // check if user already exist
    const user = await this.userRepository.findOne({
      email: resetPasswordAuthDto.email,
    });

    if (user == null) {
      throw new AppError('User not found');
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      ENV.TOKEN_RESET_KEY,
      {
        expiresIn: '2h',
      },
    );

    // SendEmail
    await this.mailService.send(user.email, {
      subject: 'Confirm change password',
      html: `<a href="${ENV.BACKOFFICE_URL}/reset-password/${user.email}/${token}">Confirm change password</a>`,
    });

    // Save Token
    await this.userRepository.update({
      where: {
        id: user?.id,
      },
      data: {
        reset_token: token,
      },
    });

    return null;
  }

  async newPassword(newPasswordAuthDto: NewPasswordAuthDto) {
    try {
      const decoded = jwt.verify(
        newPasswordAuthDto.token,
        ENV.TOKEN_RESET_KEY,
      ) as any;

      // check if user
      const user = await this.userRepository.findOne({
        email: decoded.email,
      });

      // Validation
      if (user.reset_token != newPasswordAuthDto.token) {
        throw new AppError('Error, try again');
      }
      if (decoded.email != newPasswordAuthDto.email) {
        throw new AppError('Error, try again');
      }
      if (user.id != decoded.id) {
        throw new AppError('Error, try again');
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(
        newPasswordAuthDto.password,
        10,
      );

      await this.userRepository.update({
        data: {
          password: encryptedPassword,
          reset_token: null,
        },
        where: {
          id: decoded.id,
        },
      });

      return null;
    } catch (error) {
      // decoded Error
      throw new AppError(error.message, 400);
    }
  }
}
