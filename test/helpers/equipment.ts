import { PrismaClient } from '@prisma/client';
import { CreateEquipmentDto } from 'src/shared/decorators';
import { fakeEquipment } from 'test/factory';

export class EquipmentHelper {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = global.testContext.prisma;
  }

  async createEquipment(override: Partial<CreateEquipmentDto> = {}) {
    const { ...data } = fakeEquipment(override);

    const equipment = await this.prisma.equipment.create({
      data: { ...data },
    });

    return equipment.id;
  }

  async getEquipment(id: string) {
    return this.prisma.equipment.findUnique({
      where: { id },
      include: { property: true },
    });
  }
}
