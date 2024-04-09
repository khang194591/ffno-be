import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { CreateRequestDto } from 'src/libs/dto';
import { NotificationService } from 'src/modules/services/notification.service';
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
      data: data as Prisma.RequestCreateInput,
      include: { receivers: true },
    });

    await Promise.all(
      request.receivers.map((receiver) =>
        this.notificationService.sendWebPushNotification({
          title: request.name,
          content: request.details,
          memberId: receiver.memberId,
        }),
      ),
    );

    return request.id;
  }
}
