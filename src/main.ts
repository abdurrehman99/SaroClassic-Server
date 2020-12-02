import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as helmet from 'helmet';
import * as xss from 'xss-clean';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as rateLimit from 'express-rate-limit';

async function startServer() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Sanitize data
  app.use(mongoSanitize());

  // Set security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

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
