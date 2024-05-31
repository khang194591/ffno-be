import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationModule } from '../notifications/notification.module';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [CqrsModule, NotificationModule],
  controllers: [RequestController],
  providers: [RequestService, ...CommandHandlers, ...QueryHandlers],
  exports: [RequestService],
})
export class RequestModule {}
