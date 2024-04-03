import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationPayload } from 'src/libs/dto';
import { NOTIFICATION_PATTERNS, NOTIFICATION_SERVICE } from './const';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly client: ClientProxy,
  ) {}

  async sendWebPushNotification(payload: NotificationPayload) {
    const pattern = NOTIFICATION_PATTERNS.SEND_WEB_PUSH;
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
