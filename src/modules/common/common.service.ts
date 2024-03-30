import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config';
import { InvoiceCategory } from 'src/libs/constants';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async getAmenities(): Promise<string[]> {
    const amenities = await this.prisma.propertyAmenity.findMany();
    return amenities.map(({ name }) => name);
  }

  async getInvoiceCategory(): Promise<string[]> {
    return Object.keys(InvoiceCategory);
  }
}
