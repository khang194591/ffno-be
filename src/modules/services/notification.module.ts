import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NOTIFICATION_SERVICE } from './const';

@Module({
  providers: [
    NotificationService,
    {
      provide: NOTIFICATION_SERVICE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          options: {
            port: configService.get('NOTIFICATION_SERVICE_PORT') ?? 3010,
          },
          transport: Transport.TCP,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
