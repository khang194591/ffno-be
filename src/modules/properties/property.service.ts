import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { UnitStatus } from 'src/shared';
import {
  CreatePropertyDto,
  GetPropertyResDto,
  UpdatePropertyDto,
} from 'src/libs/dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async getPropertyOrThrow(id: string): Promise<GetPropertyResDto> {
    const property = await this.prisma.property.findUniqueOrThrow({
      where: { id },
      include: {
        amenities: true,
        units: true,
        owner: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    return plainToInstance(GetPropertyResDto, property);
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

  async validatePropertyInput(
    data: CreatePropertyDto | UpdatePropertyDto,
  ): Promise<Prisma.PropertyCreateInput | Prisma.PropertyUpdateInput> {
    const {
      amenities = [],
      equipments = [],
      units = [],
      ...partialProperty
    } = data;
    await this.validateAmenities(data.amenities);
    await this.validateEquipment(data.equipments);

    return {
      ...partialProperty,
      amenities: { connect: amenities.map((name) => ({ name })) },
      equipments: { connect: equipments.map((id) => ({ id })) },
      units: {
        createMany: {
          data: units.map((unit) => ({ ...unit, status: UnitStatus.GOOD })),
        },
      },
    };
  }
}
