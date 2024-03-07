import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { UpdateUnitDto } from 'src/libs/dto';
import { PropertyService } from '../properties/property.service';

@Injectable()
export class UnitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async getUnit(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        unitFeatures: true,
      },
    });

    if (!unit) {
      throw new NotFoundException(`Unit with id = ${id} not found`);
    }

    return this.parseUnit(unit);
  }

  async getUnits() {
    const units = await this.prisma.unit.findMany({
      include: {
        unitFeatures: true,
      },
    });

    return units.map((unit) => this.parseUnit(unit));
  }

  async updateUnit(id: string, data: UpdateUnitDto) {
    await this.getUnit(id);
    await this.propertyService.validateUnit(data);

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
    await this.getUnit(id);
    await this.prisma.unit.delete({ where: { id } });

    return id;
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
