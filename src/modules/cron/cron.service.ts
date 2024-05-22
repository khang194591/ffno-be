import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { PrismaService } from 'src/config';
import {
  InvoiceCategory,
  InvoiceStatus,
  MemberRole,
  RequestCategory,
  RequestStatus,
} from 'src/libs';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  // @Cron(CronExpression.EVERY_MINUTE)
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

  @Cron(CronExpression.EVERY_HOUR)
  async fakeRequest() {
    const members = await this.prisma.member.findMany({
      where: { role: MemberRole.TENANT },
    });

    const units = await this.prisma.unit.findMany({
      where: { isListing: true },
      include: { property: true, tenants: { select: { id: true } } },
    });

    const sender = members[randomInt(members.length)];

    const unit = units[randomInt(units.length)];

    await this.prisma.request.create({
      data: {
        name: `Request least ${unit.name} - ${unit.property.name}`,
        unitId: unit.id,
        senderId: sender.id,
        status: RequestStatus.PENDING,
        category: RequestCategory.UNIT_LEASE,
        receivers: {
          createMany: {
            data: [
              unit.property.ownerId,
              ...unit.tenants.map(({ id }) => id),
            ].map((memberId) => ({
              memberId,
              status: RequestStatus.PENDING,
            })),
          },
        },
        description: faker.lorem.paragraph(),
      },
    });
  }
}
