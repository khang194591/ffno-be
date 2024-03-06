import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePropertyDto } from 'src/libs/dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async createProperty(data: CreatePropertyDto): Promise<string> {
    const { amenities, ...partialData } = data;

    const item = await this.prisma.property.create({
      data: {
        ...partialData,
        amenities: {
          connect: amenities.map((amenity) => ({ name: amenity })),
        },
      },
    });

    return item.id;
  }
}
