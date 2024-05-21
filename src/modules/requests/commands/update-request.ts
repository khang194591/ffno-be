import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { ContractStatus, RequestCategory, RequestStatus } from 'src/libs';
import { NotificationService } from 'src/modules/services/notification.service';
import { UpdateRequestDto } from 'src/shared/dto';

export class UpdateRequestCommand {
  constructor(
    public readonly memberId: string,
    public readonly data: UpdateRequestDto,
  ) {}
}

@CommandHandler(UpdateRequestCommand)
export class UpdateRequestHandler
  implements ICommandHandler<UpdateRequestCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute({ memberId, data }: UpdateRequestCommand): Promise<string> {
    const { id, status } = data;

    await this.prisma.memberReceiveRequest.update({
      where: {
        requestId_memberId: { memberId: memberId, requestId: id },
      },
      data: { status },
    });

    const receivedRequests = await this.prisma.memberReceiveRequest.findMany({
      where: { requestId: id },
    });

    const requestStatus = receivedRequests.every(
      (request) => request.status === RequestStatus.ACCEPTED,
    )
      ? RequestStatus.ACCEPTED
      : receivedRequests.some(
            (request) => request.status === RequestStatus.REJECTED,
          )
        ? RequestStatus.REJECTED
        : undefined;

    if (!requestStatus) {
      return id;
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: { status: requestStatus },
    });

    if (requestStatus === RequestStatus.ACCEPTED) {
      switch (updatedRequest.category) {
        case RequestCategory.TERMINATE_CONTRACT:
          await this.prisma.contract.update({
            where: { id: updatedRequest.contractId },
            data: {
              terminationDate: new Date(),
              status: ContractStatus.EXPIRED,
            },
          });
          break;

        default:
          break;
      }
    }

    try {
      console.log(
        `Sending notification to ${receivedRequests.map((i) => `${i.memberId} - ${i.requestId}`)}`,
      );
      await Promise.all(
        receivedRequests.map(({ memberId, requestId }) =>
          this.notificationService.sendWebPushNotification({
            title: 'Contract status updated',
            content: 'Contract status updated',
            memberId,
            link: `/requests/${requestId}`,
          }),
        ),
      );
    } catch (error) {
      console.log('Error when send notification');
      console.error(error);
    }

    return id;
  }
}
