import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from 'src/shared/errors/AppError';
import { ZodError } from 'zod';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      return response.status(exception.statusCode).json({
        success: false,
        message: exception.message,
        data: exception.data,
      });
    }

    if (exception instanceof ZodError) {
      return response.status(400).json({
        success: false,
        message: exception.message,
        data: exception.errors,
      });
    }

    console.log(exception);

    return response.status(500).json({
      status: 'error',
      message: `Internal server error`,
    });
  }
}
