import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/config';
import { ContractStatus, InvoiceCategory, InvoiceStatus } from 'src/libs';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkCreateMonthlyInvoice() {
    console.log('-------------------------------');
    const allUnits = await this.prisma.unit.findMany({
      include: {
        property: {
          select: {
            name: true,
          },
        },
        tenants: {
          select: {
            id: true,
          },
        },
      },
    });

    const chargeableUnits = allUnits.filter(
      (unit) => unit.tenants.length && unit.payerId,
    );

    const result = await this.prisma.$transaction(async (tx) =>
      Promise.all(
        chargeableUnits.map((unit) =>
          tx.invoice.create({
            data: {
              total: unit.price,
              status: InvoiceStatus.PENDING,
              category: InvoiceCategory.UNIT_CHARGE,
              unitId: unit.id,
              memberId: unit.payerId,
              dueDate: dayjs().endOf('month').toDate(),
              items: {
                create: {
                  amount: 1,
                  price: unit.price,
                  description: `Unit ${unit.name} of property ${unit.property.name} charge ${dayjs().format('MM/YYYY')}`,
                },
              },
            },
          }),
        ),
      ),
    );

    console.log(result.length);
  }

  async handleUnitListing() {
    const openUnits = await this.prisma.unit.findMany({
      where: {
        isListing: false,
        startListingAt: {
          in: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
        },
      },
    });

    const closeUnits = await this.prisma.unit.findMany({
      where: {
        isListing: true,
        endListingAt: {
          in: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
        },
      },
    });

    await this.prisma.$transaction([
      this.prisma.unit.updateMany({
        where: { id: { in: openUnits.map(({ id }) => id) } },
        data: { isListing: true },
      }),
      this.prisma.unit.updateMany({
        where: { id: { in: closeUnits.map(({ id }) => id) } },
        data: { isListing: false },
      }),
    ]);
  }

  async handleTerminateContracts() {
    const contracts = await this.prisma.contract.findMany({
      where: {
        status: ContractStatus.ACTIVE,
        endDate: {
          gte: dayjs().startOf('day').toDate(),
          lte: dayjs().endOf('day').toDate(),
        },
      },
    });

    await this.prisma.$transaction(async (tx) => {
      contracts.forEach(async (contract) => {
        await tx.member.update({
          where: { id: contract.tenantId },
          data: { unitId: null },
        });
        await tx.contract.update({
          where: { id: contract.id },
          data: {
            terminationDate: new Date(),
            status: ContractStatus.EXPIRED,
          },
        });
        await tx.invoice.create({
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
      });
    });
  }
}
