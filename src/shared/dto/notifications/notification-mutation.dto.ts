import { Exclude, Expose } from 'class-transformer';
import { INotificationResDto } from 'src/libs';

@Exclude()
export class NotificationResDto implements INotificationResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  isRead: boolean;

  @Expose()
  receiverId: string;

  @Expose()
  createdAt: Date;
}
