import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { CreateUnitDto, UpdateUnitDto } from 'src/libs/dto';
import { PropertyService } from '../properties/property.service';

@Injectable()
export class UnitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async getUnits() {
    const units = await this.prisma.unit.findMany({
      include: {
        unitFeatures: true,
      },
    });

    return units.map((unit) => this.parseUnit(unit));
  }

  async getUnitOrThrow(id: string) {
    const unit = await this.prisma.unit.findUniqueOrThrow({
      where: { id },
      include: {
        unitFeatures: true,
      },
    });

    return this.parseUnit(unit);
  }

  async createUnit(data: CreateUnitDto) {
    await this.validateUnit(data);

    const unit = await this.prisma.unit.create({
      data: {
        ...data,
        unitFeatures: { connect: data.unitFeatures.map((name) => ({ name })) },
      },
    });

    return unit.id;
  }

  async updateUnit(id: string, data: UpdateUnitDto) {
    await this.getUnitOrThrow(id);
    await this.validateUnit(data);

    const unit = await this.prisma.unit.update({
      where: { id },
      data: {
        ...data,
        unitFeatures: { connect: data.unitFeatures?.map((name) => ({ name })) },
      },
    });

    return unit.id;
  }

  async deleteUnit(id: string) {
    await this.getUnitOrThrow(id);
    await this.prisma.unit.delete({ where: { id } });

    return id;
  }

  async validateUnit(data: UpdateUnitDto) {
    const { propertyId, name, unitFeatures } = data;
    if (propertyId) {
      await this.propertyService.getPropertyOrThrow(propertyId);
    }
    if (unitFeatures) {
      await this.validateUnitFeatures(unitFeatures);
    }
    if (name && propertyId) {
      await this.validateUniqueUnitNameAndPropertyId(name, propertyId);
    }
  }

  private async validateUnitFeatures(features: string[]) {
    const foundFeatures = await this.prisma.unitFeature.findMany({
      where: { name: { in: features } },
    });

    if (foundFeatures.length !== features.length) {
      throw new BadRequestException(`Invalid unit features`);
    }
  }

  private async validateUniqueUnitNameAndPropertyId(
    name: string,
    propertyId: string,
  ) {
    const unit = await this.prisma.unit.findUnique({
      where: { name_propertyId: { name, propertyId } },
    });

    if (unit) {
      throw new BadRequestException(
        `Unit with name = ${name} and propertyId = ${propertyId}`,
      );
    }
  }

  private parseUnit(
    unit: Prisma.UnitGetPayload<{ include: { unitFeatures: true } }>,
  ) {
    return {
      ...unit,
      unitFeatures: unit.unitFeatures.map((item) => item.name),
    };
  }
}
