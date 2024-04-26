import { faker } from '@faker-js/faker/locale/vi';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { PrismaService } from 'src/config';
import {
  InvoiceCategory,
  InvoiceStatus,
  MemberRole,
  RequestCategory,
  RequestStatus,
} from 'src/libssss/constants';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  // @Cron(CronExpression.EVERY_HOUR)
  async bulkCreateMonthlyInvoice() {
    console.log('-------------------------------');
    const a = await this.prisma.unit.findMany({
      //   where: {},
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

    const b = a.filter((unit) => unit.tenants.length);

    const c: Prisma.InvoiceCreateManyArgs = {
      skipDuplicates: true,
      data: b.map((unit) => ({
        total: unit.price,
        status: InvoiceStatus.PENDING,
        category: InvoiceCategory.UNIT_CHARGE,
        unitId: unit.id,
        memberId: unit.payerId,
        details: `Unit ${unit.name} of property ${unit.property.name} charge ${dayjs().format('MM/YYYY')}`,
        dueDate: dayjs().endOf('month').toDate(),
      })),
    };

    const invoices = await this.prisma.invoice.createMany(c);
    console.log(invoices);
  }

  @Cron(CronExpression.EVERY_MINUTE)
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

    const result = await this.prisma.request.create({
      data: {
        name: `Yêu cầu thuê phòng ${unit.name} tòa nhà ${unit.property.name}`,
        unitId: unit.id,
        senderId: sender.id,
        status: RequestStatus.PENDING,
        category: RequestCategory.UNIT_LEASE,
        receivers: {
          createMany: {
            data: [
              unit.property.ownerId,
              ...unit.tenants.map(({ id }) => id),
            ].map((memberId) => ({ memberId, status: RequestStatus.PENDING })),
          },
        },
        details: faker.lorem.paragraph(),
      },
    });
    console.log(result);
  }
}
