import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function startServer() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //Helmet Middleware
  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  //Start Server on 5000 port
  await app.listen(process.env.PORT || 5000);
}
startServer();
