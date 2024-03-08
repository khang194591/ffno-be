import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import {
  CreatePropertyDto,
  GetListPropertyDto,
  UpdatePropertyDto,
} from 'src/libs/dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async getProperties(ownerId: string, query: GetListPropertyDto) {
    const {} = query;
    const properties = await this.prisma.property.findMany({
      where: { ownerId },
      include: {
        amenities: true,
        units: true,
      },
    });
    return properties.map((property) => this.parseProperty(property));
  }

  async getPropertyOrThrow(id: string) {
    const property = await this.prisma.property.findUniqueOrThrow({
      where: { id },
      include: {
        amenities: true,
        units: true,
      },
    });

    return this.parseProperty(property);
  }

  async createProperty(dto: CreatePropertyDto): Promise<string> {
    const data = await this.validatePropertyInput(dto);

    const property = await this.prisma.property.create({
      data: data as Prisma.PropertyCreateInput,
    });

    return property.id;
  }

  async updateProperty(id: string, dto: UpdatePropertyDto) {
    const data = await this.validatePropertyInput(dto);

    await this.getPropertyOrThrow(id);

    const property = await this.prisma.property.update({ where: { id }, data });

    return property.id;
  }

  async deleteProperty(id: string) {
    await this.getPropertyOrThrow(id);
    await this.prisma.property.delete({ where: { id } });

    return id;
  }

  private async validateAmenities(amenities: string[]) {
    const foundAmenities = await this.prisma.propertyAmenity.findMany({
      where: { name: { in: amenities } },
    });

    if (foundAmenities.length !== amenities.length) {
      throw new BadRequestException(`Invalid amenities`);
    }
  }

  private async validateEquipment(ids: string[] = []) {
    if (!ids.length) return;

    const foundEquipments = await this.prisma.equipment.findMany({
      where: { id: { in: ids } },
    });

    if (foundEquipments.length !== ids.length) {
      throw new BadRequestException(`Invalid equipment IDs`);
    }
  }

  private async validatePropertyInput(
    data: CreatePropertyDto | UpdatePropertyDto,
  ): Promise<Prisma.PropertyCreateInput | Prisma.PropertyUpdateInput> {
    const { amenities = [], equipments = [], ...partialProperty } = data;
    await this.validateAmenities(data.amenities);
    await this.validateEquipment(data.equipments);

    return {
      ...partialProperty,
      amenities: { connect: amenities.map((name) => ({ name })) },
      equipments: { connect: equipments.map((id) => ({ id })) },
    };
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
