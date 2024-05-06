import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { CreateInvoiceDto } from 'src/shared/dto';
import { InvoiceService } from '../invoice.service';

export class CreateInvoiceCommand {
  constructor(public readonly data: CreateInvoiceDto) {}
}

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceHandler
  implements ICommandHandler<CreateInvoiceCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async execute(query: CreateInvoiceCommand): Promise<number> {
    const data = await this.invoiceService.validateInvoiceInput(query.data);

    const invoice = await this.prisma.invoice.create({ data });

    return invoice.id;
  }
}
