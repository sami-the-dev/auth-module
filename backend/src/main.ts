import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setupApp } from './setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  setupApp(app, config.get<string>('CORS_ORIGIN'));
  app.enableShutdownHooks();
  await app.listen(config.get<number>('PORT', 3000));
}
bootstrap();
