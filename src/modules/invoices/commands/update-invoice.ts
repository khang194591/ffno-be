import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { UpdateInvoiceDto } from 'src/libs/dto';
import { InvoiceService } from '../invoice.service';

export class UpdateInvoiceCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateInvoiceDto,
  ) {}
}

@CommandHandler(UpdateInvoiceCommand)
export class UpdateInvoiceHandler
  implements ICommandHandler<UpdateInvoiceCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async execute(query: UpdateInvoiceCommand): Promise<string> {
    const { id } = query;
    const data = await this.invoiceService.validateInvoiceInput(query.data);

    await this.invoiceService.getInvoiceOrThrow(id);

    const invoice = await this.prisma.invoice.update({ where: { id }, data });

    return invoice.id;
  }
}
