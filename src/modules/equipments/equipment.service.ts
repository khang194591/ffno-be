import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import {
  CreateEquipmentDto,
  GetListEquipmentQuery,
  UpdateEquipmentDto,
} from 'src/libs/dto';
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

  async getEquipments(query: GetListEquipmentQuery) {
    const { propertyId } = query;
    if (propertyId) {
      return this.getEquipmentsByPropertyId(propertyId);
    }

    const equipments = await this.prisma.equipment.findMany({
      include: { property: true },
    });

    return equipments.map((equipment) => this.parseEquipment(equipment));
  }

  async getEquipmentsByPropertyId(propertyId: string) {
    return this.prisma.equipment.findMany({ where: { propertyId } });
  }

  async getEquipmentOrThrow(id: string) {
    const equipment = await this.prisma.equipment.findUniqueOrThrow({
      where: { id },
      include: { property: true },
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
