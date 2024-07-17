import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/config';
import {
  EmailPayload,
  NOTIFICATION_PATTERNS,
  NOTIFICATION_SERVICE,
  NotificationPayload,
} from 'src/libs';
import { NotificationResDto } from 'src/shared/dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly client: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async sendWebPushNotification(payload: NotificationPayload) {
    const pattern = NOTIFICATION_PATTERNS.SEND_WEB_PUSH;
    await this.prisma.notification.create({
      data: {
        title: payload.title,
        content: payload.content,
        receiverId: payload.memberId,
        contractId: payload.contractId,
        requestId: payload.requestId,
      },
    });
    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async sendEmail(payload: EmailPayload) {
    const pattern = NOTIFICATION_PATTERNS.SEND_EMAIL;
    return await lastValueFrom(this.client.send(pattern, payload));
  }

  async getAllNotification(memberId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        receiverId: memberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      total: notifications.length,
      data: plainToInstance(NotificationResDto, notifications),
    };
  }

  async markAsRead(memberId: string, notificationId: string) {
    console.log(memberId, notificationId);

    return this.prisma.notification.update({
      where: { id: notificationId, receiverId: memberId },
      data: { isRead: true },
    });
  }

  async markAsUnread(memberId: string, notificationId: string) {
    console.log(memberId, notificationId);

    return this.prisma.notification.update({
      where: { id: notificationId, receiverId: memberId },
      data: { isRead: false },
    });
  }

  async markAllAsRead(memberId: string) {
    return this.prisma.notification.updateMany({
      where: { receiverId: memberId },
      data: { isRead: true },
    });
  }
}
