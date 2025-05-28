import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Morgan for HTTP request logging
  app.use(morgan('dev')); // Logs: :method :url :status :response-time ms

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
