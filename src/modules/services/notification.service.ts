import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NOTIFICATION_PATTERNS, NOTIFICATION_SERVICE } from 'src/libs';
import { EmailPayload, NotificationPayload } from 'src/shared/dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly client: ClientProxy,
  ) {}

  async sendWebPushNotification(payload: NotificationPayload) {
    const pattern = NOTIFICATION_PATTERNS.SEND_WEB_PUSH;
    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async sendEmail(payload: EmailPayload) {
    const pattern = NOTIFICATION_PATTERNS.SEND_EMAIL;
    return await lastValueFrom(this.client.send(pattern, payload));
  }
}
