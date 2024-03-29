import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaService } from 'src/config';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
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
        code: `${unit.id}#${dayjs().format('MM/YYYY')}`,
        amount: unit.price,
        category: 'Unit charge',
        unitId: unit.id,
        memberId: unit.payerId,
        details: `Unit ${unit.name} of property ${unit.property.name} charge ${dayjs().format('MM/YYYY')}`,
        dueDate: dayjs().endOf('month').toDate(),
      })),
    };

    const invoices = await this.prisma.invoice.createMany(c);
    console.log(invoices);
  }
}
