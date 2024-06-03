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

  async getEquipmentCategories(): Promise<string[]> {
    const items = await this.prisma.equipmentCategory.findMany();
    return items.map(({ name }) => name);
  }

  async getProperties() {
    const items = await this.prisma.property.findMany({
      select: { id: true, name: true },
    });

    return items.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }

  async getUnits(propertyId?: string) {
    const items = await this.prisma.unit.findMany({
      where: { propertyId },
      select: { id: true, name: true },
    });

    return items.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }

  async getEquipments({
    propertyId,
    unitId,
  }: {
    propertyId?: string;
    unitId?: string;
  }) {
    const items = await this.prisma.equipment.findMany({
      where: { propertyId, unitId },
      select: { id: true, name: true },
    });

    return items.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }
}
