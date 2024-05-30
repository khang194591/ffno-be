import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { NotificationService } from 'src/modules/services/notification.service';
import { CreateRequestDto } from 'src/shared/dto';
import { RequestService } from '../request.service';

export class CreateRequestCommand {
  constructor(
    public readonly staffId: string,
    public readonly data: CreateRequestDto,
  ) {}
}

@CommandHandler(CreateRequestCommand)
export class CreateRequestHandler
  implements ICommandHandler<CreateRequestCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestService: RequestService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(query: CreateRequestCommand): Promise<string> {
    const data = await this.requestService.validateRequestInput(
      query.staffId,
      query.data,
    );

    const request = await this.prisma.request.create({
      data,
      include: { receivers: true },
    });

    try {
      await Promise.all(
        request.receivers.map((receiver) =>
          this.notificationService.sendWebPushNotification({
            title: request.name,
            content: request.description,
            memberId: receiver.memberId,
            link: `/requests/${request.id}`,
          }),
        ),
      );
    } catch (error) {
      console.log('Error when send notification');
      console.error(error);
    }

    return request.id;
  }
}
