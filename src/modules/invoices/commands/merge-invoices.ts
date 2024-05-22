import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Decimal from 'decimal.js';
import { PrismaService } from 'src/config';
import { InvoiceCategory, InvoiceStatus } from 'src/libs';
import { MergeInvoicesDto } from 'src/shared/dto';
import { InvoiceService } from '../invoice.service';

export class MergeInvoicesCommand {
  constructor(public readonly data: MergeInvoicesDto) {}
}

@CommandHandler(MergeInvoicesCommand)
export class MergeInvoicesHandler
  implements ICommandHandler<MergeInvoicesCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async execute({ data }: MergeInvoicesCommand): Promise<number> {
    const { ids } = data;

    const invoices = await this.prisma.invoice.findMany({
      where: { id: { in: ids } },
      include: {
        items: true,
      },
    });

    const memberIds = new Set(invoices.map((invoice) => invoice.memberId));

    if (memberIds.size !== 1) {
      throw new BadRequestException(
        'All invoices must have same bill to member',
      );
    }

    const fullyPaid = invoices.every((i) => i.status === InvoiceStatus.PAID);
    const partialPaid = !!invoices.find((invoice) => !!invoice.paid);

    const mergedInvoice = await this.prisma.invoice.create({
      data: {
        memberId: memberIds[0],
        unitId: invoices[0].unitId,
        category: InvoiceCategory.MERGED,
        status: fullyPaid
          ? InvoiceStatus.PAID
          : partialPaid
            ? InvoiceStatus.PARTIAL
            : InvoiceStatus.PENDING,
        dueDate: new Date(),
        total: invoices.reduce(
          (acc, invoice) => Decimal.add(acc, invoice.total),
          new Decimal(0),
        ),
        items: {
          connect: invoices
            .flatMap(({ items }) => items)
            .map(({ id }) => ({ id })),
        },
      },
    });

    await this.prisma.invoice.updateMany({
      where: { id: { in: ids } },
      data: { status: InvoiceStatus.MERGED, mergedId: mergedInvoice.id },
    });

    return mergedInvoice.id;
  }
}
