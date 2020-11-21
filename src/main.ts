import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function startServer() {
  const app = await NestFactory.create(AppModule);

  //Enable cors Globally
  app.enableCors();

  //Helmet Middleware
  app.use(helmet());

  //Start Server on 5000 port
  await app.listen(process.env.PORT || 5000);
}
startServer();
