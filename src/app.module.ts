import { Module } from '@nestjs/common';
import 'dotenv/config';

import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
})
export class AppModule {}
