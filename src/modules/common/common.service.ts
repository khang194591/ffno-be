import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async getPropertyAmenities(): Promise<string[]> {
    const amenities = await this.prisma.propertyAmenity.findMany();
    return amenities.map(({ name }) => name);
  }

  async getUnitFeatures(): Promise<string[]> {
    const items = await this.prisma.unitFeature.findMany();
    return items.map(({ name }) => name);
  }
}
