import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import * as webPush from 'web-push';
import { join } from 'path';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { v4 } from 'uuid';

type device = {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
};

@Controller()
export class AppController {
  // load client site
  @Get('/*')
  client(@Req() req, @Res() res): any {
    try {
      const filePath = join(__dirname, `../client/${req.url}`);
      if (existsSync(filePath)) {
        return res.sendFile(filePath);
      }

      throw new NotFoundException();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // register device info
  @Post('/register')
  register(@Body() device: device): boolean {
    try {
      const filePath = join(__dirname, '../data/data.json');
      const data = JSON.parse(readFileSync(filePath, 'utf-8'));
      data.push({
        userId: v4(),
        device,
      });

      writeFileSync(filePath, JSON.stringify(data));

      return true;
    } catch (error) {
      return error;
    }
  }

  // push notify to browser
  @Post('/subscribe/:userId')
  test(@Param('userId') userId: string): boolean {
    const filePath = join(__dirname, '../data/data.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const user = data.find((item) => item.userId === userId);

    if (!user) {
      throw new NotFoundException();
    }

    const payload = JSON.stringify({
      title: 'You have a message',
    });

    webPush
      .sendNotification(user.device, payload)
      .catch((error) => console.error(error));

    return true;
  }
}
