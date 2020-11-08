import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function startServer() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 5000);
}
startServer();
