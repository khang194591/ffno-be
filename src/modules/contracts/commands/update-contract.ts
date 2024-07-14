import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/config';
import {
  ContractStatus,
  InvoiceCategory,
  InvoiceStatus,
  MemberRole,
  RequestStatus,
  contractStatusRecord,
} from 'src/libs';
import { NotificationService } from 'src/modules/notifications/notification.service';
import { MemberResDto, UpdateContractDto } from 'src/shared/dto';

export class UpdateContractCommand {
  constructor(
    public readonly currentMember: MemberResDto,
    public readonly id: number,
    public readonly data: UpdateContractDto,
  ) {}
}

@CommandHandler(UpdateContractCommand)
export class UpdateContractHandler
  implements ICommandHandler<UpdateContractCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(query: UpdateContractCommand): Promise<number> {
    const {
      currentMember,
      id,
      data: { status, startDate, endDate, terminationDate, imgUrls },
    } = query;

    const contract = await this.prisma.contract.findUnique({ where: { id } });

    const isParticipant =
      currentMember.id === contract.landlordId ||
      currentMember.id === contract.tenantId;

    if (currentMember.role !== MemberRole.ADMIN && !isParticipant) {
      throw new ForbiddenException('You cannot edit this contract');
    }

    if (status && isParticipant) {
      return this.handleUpdateStatus(currentMember, status, id);
    }

    await this.prisma.contract.update({
      where: { id },
      data: {
        startDate,
        endDate,
        terminationDate,
        imgUrls,
      },
    });

    return id;
  }

  private async handleUpdateStatus(
    currentMember: MemberResDto,
    status: RequestStatus,
    id: number,
  ) {
    const data: Prisma.ContractUpdateInput = {};
    const isTenant = currentMember.role === MemberRole.TENANT;
    if (isTenant) {
      data.tenantStatus = status;
    }
    data.landlordStatus = status;

    const updatedContract = await this.prisma.contract.update({
      where: { id },
      data,
    });

    let contractStatus: ContractStatus;

    if (
      updatedContract.landlordStatus === RequestStatus.ACCEPTED &&
      updatedContract.tenantStatus === RequestStatus.ACCEPTED
    ) {
      contractStatus = ContractStatus.ACTIVE;
    }

    if (
      [updatedContract.landlordStatus, updatedContract.tenantStatus].includes(
        RequestStatus.REJECTED,
      )
    ) {
      contractStatus = ContractStatus.REJECTED;
    }

    if (contractStatus) {
      await this.prisma.contract.update({
        where: { id },
        data: { status: contractStatus },
      });
      await Promise.all(
        [updatedContract.landlordId, updatedContract.tenantId].map((memberId) =>
          this.notificationService.sendWebPushNotification({
            title: `Contract has been ${contractStatusRecord[contractStatus]}`,
            content: 'Review it now',
            memberId,
            link: `/contracts/${updatedContract.id}`,
          }),
        ),
      );
    }

    // Move in tenant
    if (contractStatus === ContractStatus.ACTIVE) {
      const unit = await this.prisma.unit.update({
        where: { id: updatedContract.unitId },
        data: { tenants: { connect: { id: updatedContract.tenantId } } },
      });
      await this.prisma.invoice.create({
        data: {
          category: InvoiceCategory.DEPOSIT,
          dueDate: dayjs().add(10, 'day').toDate(),
          status: InvoiceStatus.PENDING,
          total: unit.deposit,
          unitId: unit.id,
          memberId: updatedContract.tenantId,
          items: {
            create: {
              amount: 1,
              price: unit.deposit,
              description: `Deposit of contract #${id}`,
            },
          },
        },
      });
    }

    return id;
  }
}
