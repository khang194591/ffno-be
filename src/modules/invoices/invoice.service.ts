import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { InvoiceStatus } from 'src/libs/constants';
import { CreateInvoiceDto, GetInvoiceResDto } from 'src/libs/dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getInvoiceOrThrow(id: number): Promise<GetInvoiceResDto> {
    const invoice = await this.prisma.invoice.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(GetInvoiceResDto, invoice);
  }

  async validateInvoiceInput(
    data: CreateInvoiceDto,
  ): Promise<Prisma.InvoiceCreateInput> {
    const { isPaid, unitId, memberId, items, ...partialInvoice } = data;

    const { tenants } = await this.prisma.unit.findUniqueOrThrow({
      where: { id: unitId },
      select: { tenants: { select: { id: true } } },
    });

    if (!tenants.find((tenant) => tenant.id === memberId)) {
      throw new BadRequestException(
        `Tenant ${memberId} must be in unit ${unitId} to charge fee`,
      );
    }

    return {
      ...partialInvoice,
      paidAt: isPaid ? new Date() : null,
      status: InvoiceStatus.PENDING,
      unit: { connect: { id: unitId } },
      member: { connect: { id: memberId } },
      items: { createMany: { data: items } },
    };
  }
}
