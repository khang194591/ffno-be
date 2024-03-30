import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  CreateInvoiceDto,
  GetInvoiceResDto,
  UpdateInvoiceDto,
} from 'src/libs/dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getInvoiceOrThrow(id: string): Promise<GetInvoiceResDto> {
    const invoice = await this.prisma.invoice.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(GetInvoiceResDto, invoice);
  }

  async validateInvoiceInput(
    data: CreateInvoiceDto | UpdateInvoiceDto,
  ): Promise<Prisma.InvoiceCreateInput | Prisma.InvoiceUpdateInput> {
    const { unitId, memberId, ...partialInvoice } = data;
    const { tenants } = await this.prisma.unit.findUniqueOrThrow({
      where: { id: unitId },
      select: { tenants: true },
    });

    if (!tenants.find((tenant) => tenant.id === memberId)) {
      throw new BadRequestException(
        `Tenant ${memberId} must be in unit ${unitId} to charge fee`,
      );
    }

    return {
      ...partialInvoice,
      code: `${faker.string.alphanumeric({ length: 10 })}`,
      unit: { connect: { id: unitId } },
      member: { connect: { id: memberId } },
    };
  }
}
