import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config';
import {
  AddUnitDto,
  CreatePropertyDto,
  UpdatePropertyDto,
  UpdateUnitDto,
} from 'src/libs/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async getProperties(ownerId: string) {
    const properties = await this.prisma.property.findMany({
      where: { ownerId },
      include: {
        amenities: true,
        units: true,
      },
    });
    return properties.map((property) => this.parseProperty(property));
  }

  async getProperty(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        amenities: true,
        units: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with id = ${id} not found`);
    }

    return this.parseProperty(property);
  }

  async createProperty(data: CreatePropertyDto): Promise<string> {
    const { amenities, ...partialProperty } = data;

    await this.validateAmenities(amenities);

    const property = await this.prisma.property.create({
      data: {
        ...partialProperty,
        amenities: { connect: amenities.map((amenity) => ({ name: amenity })) },
      },
    });

    return property.id;
  }

  async updateProperty(id: string, data: UpdatePropertyDto) {
    const { amenities, ...partialProperty } = data;

    await this.validateAmenities(amenities);
    await this.getProperty(id);

    const property = await this.prisma.property.update({
      where: { id },
      data: {
        ...partialProperty,
        amenities: { connect: amenities.map((amenity) => ({ name: amenity })) },
      },
    });

    return property.id;
  }

  async deleteProperty(id: string) {
    await this.getProperty(id);
    await this.prisma.property.delete({ where: { id } });

    return id;
  }

  async addUnit(data: AddUnitDto) {
    await this.validateUnit(data);

    const unit = await this.prisma.unit.create({
      data: {
        ...data,
        unitFeatures: { connect: data.unitFeatures.map((name) => ({ name })) },
      },
    });

    return unit.id;
  }

  async validateUnit(data: UpdateUnitDto) {
    const { propertyId, name, unitFeatures } = data;
    if (propertyId) {
      await this.getProperty(propertyId);
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

  private async validateAmenities(amenities: string[]) {
    const foundAmenities = await this.prisma.propertyAmenity.findMany({
      where: { name: { in: amenities } },
    });

    if (foundAmenities.length !== amenities.length) {
      throw new BadRequestException(`Invalid amenities`);
    }
  }

  private parseProperty(
    property: Prisma.PropertyGetPayload<{ include: { amenities: true } }>,
  ) {
    return {
      ...property,
      amenities: property.amenities.map((item) => item.name),
    };
  }
}
