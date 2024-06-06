import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs';
import { MemberResDto } from 'src/shared/dto';

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

  async getProperties({ member }: { member?: MemberResDto }) {
    const where: Prisma.PropertyWhereInput = {};

    if (member && member.role === MemberRole.LANDLORD) {
      where.ownerId = member.id;
    }

    const items = await this.prisma.property.findMany({
      where,
      select: { id: true, name: true },
    });

    return items.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }

  async getUnits({
    propertyId,
    member,
  }: {
    member?: MemberResDto;
    propertyId?: string;
  }) {
    const where: Prisma.UnitWhereInput = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (member && member.role === MemberRole.LANDLORD) {
      where.property = { ownerId: member.id };
    }

    const items = await this.prisma.unit.findMany({
      where,
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
