import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetInvoiceResDto } from 'src/libs/dto';

export class GetInvoiceQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetInvoiceQuery)
export class GetInvoiceHandler implements IQueryHandler<GetInvoiceQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: GetInvoiceQuery): Promise<GetInvoiceResDto> {
    const invoice = await this.prisma.invoice.findUniqueOrThrow({
      where: { id },
      include: {
        unit: { select: { name: true } },
        member: { select: { name: true } },
      },
    });

    return plainToInstance(GetInvoiceResDto, invoice);
  }
}
