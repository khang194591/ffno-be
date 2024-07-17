import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { PrismaService } from 'src/config';
import {
  ContactType,
  ContractStatus,
  InvoiceCategory,
  InvoiceStatus,
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

    const requestStatus =
      status === RequestStatus.DONE
        ? RequestStatus.DONE
        : receivedRequests.every(
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
      switch (updatedRequest.category) {
        case RequestCategory.REQUEST_EQUIPMENT:
          if (updatedRequest.status === RequestStatus.ACCEPTED) {
            await this.prisma.request.update({
              where: { id },
              data: { status: 'HANDLING' },
            });
          }
          break;
        case RequestCategory.UNIT_LEASE:
          await this.prisma.memberContacts.createMany({
            data: [
              {
                type: ContactType.TENANT,
                contactId: currentMemberId,
                contactWithId: updatedRequest.senderId,
              },
              {
                type: ContactType.TENANT,
                contactWithId: currentMemberId,
                contactId: updatedRequest.senderId,
              },
            ],
            skipDuplicates: true,
          });
          const unit = await this.prisma.unit.findUnique({
            where: { id: updatedRequest.unitId },
            include: { tenants: true },
          });

          if (unit.maxSlot === unit.tenants.length + 1) {
            await this.prisma.request.updateMany({
              where: {
                category: RequestCategory.UNIT_LEASE,
                status: RequestStatus.PENDING,
                unitId: updatedRequest.unitId,
                senderId: { not: updatedRequest.senderId },
              },
              data: {
                status: RequestStatus.REJECTED,
              },
            });
          }
          break;
        case RequestCategory.TERMINATE_CONTRACT:
          const contract = await this.prisma.contract.update({
            where: { id: updatedRequest.contractId },
            data: {
              terminationDate: new Date(),
              status: ContractStatus.EXPIRED,
            },
          });
          await this.prisma.member.update({
            where: { id: contract.tenantId },
            data: { unitId: null },
          });
          if (updatedRequest.senderId === contract.landlordId) {
            await this.prisma.invoice.create({
              data: {
                total: contract.deposit,
                status: InvoiceStatus.PENDING,
                unitId: contract.unitId,
                dueDate: dayjs().add(10, 'day').toDate(),
                memberId: contract.tenantId,
                category: InvoiceCategory.DEPOSIT_REFUND,
                items: {
                  create: {
                    amount: 1,
                    price: contract.deposit,
                    description: `Refund deposit for contract #${contract.id}`,
                  },
                },
              },
            });
          }
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
          if (updatedRequest.status === RequestStatus.ACCEPTED) {
            await this.prisma.request.update({
              where: { id },
              data: { status: 'HANDLING' },
            });
          }
          break;
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
            break;
          }
        default:
          break;
      }
    }

    if (requestStatus === RequestStatus.DONE) {
      this.notificationService.sendWebPushNotification({
        title: 'Request status updated',
        content: 'Request status updated',
        memberId: updatedRequest.senderId,
        link: `/requests/${updatedRequest.id}`,
        requestId: updatedRequest.id,
      });
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
            requestId: requestId,
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
