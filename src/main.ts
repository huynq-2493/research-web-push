import { NestFactory } from '@nestjs/core';
import * as webPush from 'web-push';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  webPush.setVapidDetails(
    process.env.SUBJECT,
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY,
  );

  await app.listen(process.env.PORT);
}
bootstrap();
