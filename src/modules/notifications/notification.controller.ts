import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/shared/decorators';
import { IdUUIDParams } from 'src/shared/dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getListNotification(@CurrentMemberId() memberId: string) {
    return this.notificationService.getAllNotification(memberId);
  }

  @Put('mask-as-read')
  async markAllAsRead(@CurrentMemberId() memberId: string) {
    return this.notificationService.markAllAsRead(memberId);
  }

  @Put('mark-as-read/:id')
  async markAsRead(
    @CurrentMemberId() memberId: string,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.notificationService.markAsRead(memberId, id);
  }
}
