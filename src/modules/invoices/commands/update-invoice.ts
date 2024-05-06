import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { UpdateInvoiceDto } from 'src/shared/dto';
import { InvoiceService } from '../invoice.service';

export class UpdateInvoiceCommand {
  constructor(
    public readonly id: number,
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

  async execute({ id }: UpdateInvoiceCommand): Promise<number> {
    // const data = await this.invoiceService.validateInvoiceInput(query.data);

    // await this.invoiceService.getInvoiceOrThrow(id);

    // const invoice = await this.prisma.invoice.update({ where: { id }, data });

    return id;
  }
}
