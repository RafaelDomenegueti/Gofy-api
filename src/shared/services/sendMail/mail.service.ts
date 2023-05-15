import { Injectable } from '@nestjs/common';
import { ENV } from '../../../utils/env';
import nodemailer from 'nodemailer';

@Injectable()
export default class MailService {
  transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV.EMAIL_HOST,
      port: ENV.EMAIL_PORT,
      auth: {
        user: ENV.EMAIL_AUTH_USER,
        pass: ENV.EMAIL_AUTH_PASS,
      },
    });
  }

  async send(recipient: string, data: object) {
    const sendResponse = await this.transporter.sendMail({
      from: ENV.SENDER_EMAIL,
      to: recipient,
      ...data,
    });

    return sendResponse;
  }
}
