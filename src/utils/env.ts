import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const ENV = {
  TOKEN_KEY: process.env.TOKEN_KEY || '',
  TOKEN_RESET_KEY: process.env.TOKEN_RESET_KEY || '',
  EMAIL_AUTH_USER: process.env.EMAIL_AUTH_USER || '',
  EMAIL_AUTH_PASS: process.env.EMAIL_AUTH_PASS || '',
  SENDER_EMAIL: process.env.SENDER_EMAIL || '',
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_PORT: process.env.EMAIL_PORT || '',
  BACKOFFICE_URL: process.env.BACKOFFICE_URL || '',
  CLOUDINARY_CLIENT_ID: process.env.CLOUDINARY_CLIENT_ID || '',
  CLOUDINARY_CLIENT_SECRET: process.env.CLOUDINARY_CLIENT_SECRET || '',
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || '',
  YOUTUBE_PROXY: process.env.YOUTUBE_PROXY || '',
  YOUTUBE_COOKIES: JSON.parse(process.env.YOUTUBE_COOKIES || '[]'),
};
