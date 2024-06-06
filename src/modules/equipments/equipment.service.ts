import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  CreateEquipmentDto,
  EquipmentResDto,
  GetListEquipmentQuery,
  UpdateEquipmentDto,
} from 'src/shared/dto';
import { PropertyService } from '../properties/property.service';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async createEquipment(dto: CreateEquipmentDto) {
    await this.validateEquipmentDto(dto);

    const equipment = await this.prisma.equipment.create({
      data: dto,
    });

    return equipment.id;
  }

  async updateEquipment(id: string, dto: UpdateEquipmentDto) {
    await this.validateEquipmentDto(dto);

    const equipment = await this.prisma.equipment.update({
      where: { id },
      data: dto,
    });

    return equipment.id;
  }

  async getEquipments(memberId: string, query: GetListEquipmentQuery) {
    const { propertyId, unitId, take, skip } = query;

    const where: Prisma.EquipmentWhereInput = {};

    if (!propertyId && !unitId) {
      where.property = { ownerId: memberId };
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (unitId) {
      where.unitId = unitId;
    }

    const [total, equipments] = await this.prisma.$transaction([
      this.prisma.equipment.count({ where }),
      this.prisma.equipment.findMany({
        where,
        take,
        skip,
        include: { property: true, unit: true },
      }),
    ]);

    return {
      total,
      data: plainToInstance(EquipmentResDto, equipments),
    };
  }

  async getEquipmentsByPropertyId(propertyId: string) {
    return this.prisma.equipment.findMany({ where: { propertyId } });
  }

  async getEquipmentOrThrow(id: string) {
    const equipment = await this.prisma.equipment.findUniqueOrThrow({
      where: { id },
      include: { property: true, unit: true },
    });

    return this.parseEquipment(equipment);
  }

  async validateCategory(category: string) {
    await this.prisma.equipmentCategory.findUniqueOrThrow({
      where: { name: category },
    });
  }

  async validateEquipmentDto(dto: CreateEquipmentDto | UpdateEquipmentDto) {
    const { category, propertyId } = dto;
    if (category) {
      await this.validateCategory(category);
    }
    if (propertyId) {
      await this.propertyService.getPropertyOrThrow(propertyId);
    }
  }

  async parseEquipment(
    equipment: Prisma.EquipmentGetPayload<{ include: { property: true } }>,
  ) {
    return {
      ...equipment,
    };
  }
}
