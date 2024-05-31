import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import {
  ContactType,
  ContractStatus,
  RequestCategory,
  RequestStatus,
  UnitStatus,
} from 'src/libs';
import { NotificationService } from 'src/modules/notifications/notification.service';
import { UpdateRequestDto } from 'src/shared/dto';

export class UpdateRequestCommand {
  constructor(
    public readonly currentMemberId: string,
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

  async execute({
    data,
    currentMemberId,
  }: UpdateRequestCommand): Promise<string> {
    const { id, status } = data;

    await this.prisma.memberReceiveRequest.update({
      where: {
        requestId_memberId: { memberId: currentMemberId, requestId: id },
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

    // Return when not change request status
    if (!requestStatus) {
      return id;
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: { status: requestStatus },
    });

    if (requestStatus === RequestStatus.ACCEPTED) {
      await this.prisma.memberContacts.create({
        data: {
          type: ContactType.TENANT,
          contactId: currentMemberId,
          contactWithId: updatedRequest.senderId,
        },
      });
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
        case RequestCategory.REPORT_ISSUE:
          if (updatedRequest.unitId) {
            await this.prisma.unit.update({
              where: { id: updatedRequest.unitId },
              data: { status: UnitStatus.BAD },
            });
          }
          if (updatedRequest.equipmentId) {
            await this.prisma.equipment.update({
              where: { id: updatedRequest.equipmentId },
              data: { maintainStatus: UnitStatus.BAD },
            });
          }
        case RequestCategory.EQUIPMENT_WARRANTY:
          if (updatedRequest.unitId) {
            await this.prisma.unit.update({
              where: { id: updatedRequest.unitId },
              data: { status: UnitStatus.MAINTAINING },
            });
            break;
          }
          if (updatedRequest.equipmentId) {
            await this.prisma.equipment.update({
              where: { id: updatedRequest.equipmentId },
              data: { maintainStatus: UnitStatus.MAINTAINING },
            });
          }
        default:
          break;
      }
    }

    // Send notifications
    try {
      console.log(
        `Sending notification to ${receivedRequests.map((i) => `${i.memberId} - ${i.requestId}`)}`,
      );
      await Promise.all(
        receivedRequests.map(({ memberId, requestId }) =>
          this.notificationService.sendWebPushNotification({
            title: 'Request status updated',
            content: 'Request status updated',
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
