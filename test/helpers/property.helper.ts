import { Prisma, PrismaClient } from '@prisma/client';
import { AddUnitDto, CreatePropertyDto } from 'src/libs/dto';
import { fakeProperty } from 'test/factory/property';

export class PropertyHelper {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = global.testContext.prisma;
  }

  async createAmenities(amenities: string[] = ['Pool', 'Playground']) {
    return this.prisma.propertyAmenity.createMany({
      data: amenities.map((name) => ({ name })),
    });
  }

  async createUnitFeatures(
    features: string[] = ['Dishwasher', 'Internet', 'Balcony'],
  ) {
    return this.prisma.unitFeature.createMany({
      data: features.map((name) => ({ name })),
    });
  }

  async createProperty(
    ownerId: string,
    override: Partial<CreatePropertyDto> = {},
    units: AddUnitDto[] = [],
  ) {
    const { amenities, ...partialData } = fakeProperty(ownerId, override);

    const item = await this.prisma.property.create({
      data: {
        ...partialData,
        amenities: {
          connect: amenities.map((amenity) => ({ name: amenity })),
        },
      },
    });

    if (units.length) {
      await Promise.all(
        units.map((unit) => {
          const { unitFeatures, ...partialUnit } = unit;
          return this.prisma.unit.create({
            data: {
              ...partialUnit,
              propertyId: item.id,
              unitFeatures: { connect: unitFeatures.map((name) => ({ name })) },
            },
          });
        }),
      );
    }

    return item.id;
  }

  async getProperty(id: string) {
    const item = await this.prisma.property.findUnique({
      where: { id },
      include: { amenities: true, units: true },
    });

    return this.parseProperty(item);
  }

  async getUnit(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        unitFeatures: true,
      },
    });

    return this.parseUnit(unit);
  }

  private parseUnit(
    unit: Prisma.UnitGetPayload<{
      include: { unitFeatures: true };
    }>,
  ) {
    return {
      ...unit,
      unitFeatures: unit.unitFeatures.map((item) => item.name),
    };
  }

  private parseProperty(
    property: Prisma.PropertyGetPayload<{
      include: { amenities: true; units: true };
    }>,
  ) {
    return {
      ...property,
      amenities: property.amenities.map((item) => item.name),
    };
  }

  async clearAmenities() {
    await this.prisma.propertyAmenity.deleteMany();
  }

  async clearUnitFeatures() {
    await this.prisma.unitFeature.deleteMany();
  }

  async clearUnits() {
    await this.clearUnitFeatures();
    await this.prisma.unit.deleteMany();
  }

  async clearProperties() {
    await this.clearAmenities();
    await this.clearUnits();
    await this.prisma.property.deleteMany();
  }
}
