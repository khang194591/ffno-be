import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  CreatePropertyDto,
  GetListPropertyDto,
  GetListResDto,
  GetMemberResDto,
  GetPropertyResDto,
  UpdatePropertyDto,
} from 'src/libs/dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async getProperties(
    ownerId: string,
    query: GetListPropertyDto,
  ): Promise<GetListResDto<GetPropertyResDto>> {
    const { name, type, ward, district, province, amenities, take, skip } =
      query;

    const where: Prisma.PropertyWhereInput = {
      ownerId,
      type,
      ward,
      district,
      province,
      amenities: amenities && { some: { name: { in: amenities } } },
    };

    const [total, properties] = await this.prisma.$transaction([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        take,
        skip,
        include: {
          amenities: true,
          units: true,
        },
        orderBy: {
          _relevance: name && {
            fields: ['name'],
            search: name.split(' ').join(' | '),
            sort: 'desc',
          },
        },
      }),
    ]);

    return {
      total,
      data: plainToInstance(GetPropertyResDto, properties),
    };
  }

  async getPropertyOrThrow(id: string): Promise<GetPropertyResDto> {
    const property = await this.prisma.property.findUniqueOrThrow({
      where: { id },
      include: {
        amenities: true,
        units: true,
      },
    });

    return plainToInstance(GetPropertyResDto, property);
  }

  async createProperty(dto: CreatePropertyDto): Promise<string> {
    const data = await this.validatePropertyInput(dto);

    const property = await this.prisma.property.create({
      data: data as Prisma.PropertyCreateInput,
    });

    return property.id;
  }

  async updateProperty(id: string, dto: UpdatePropertyDto): Promise<string> {
    const data = await this.validatePropertyInput(dto);

    await this.getPropertyOrThrow(id);

    const property = await this.prisma.property.update({ where: { id }, data });

    return property.id;
  }

  async deleteProperty(id: string): Promise<string> {
    await this.getPropertyOrThrow(id);
    await this.prisma.property.delete({ where: { id } });

    return id;
  }

  async getTenants(id: string): Promise<GetListResDto<GetMemberResDto>> {
    const units = await this.prisma.unit.findMany({
      where: { propertyId: id },
      select: {
        name: true,
        tenants: {
          select: {
            id: true,
            name: true,
            gender: true,
            imgUrl: true,
            address: true,
            dateOfBirth: true,
            identityNumber: true,
            identityImgUrls: true,
          },
        },
      },
    });

    const tenants = units.flatMap((unit) =>
      unit.tenants.map((tenant) => ({ ...tenant, unit })),
    );

    return {
      total: tenants.length,
      data: plainToInstance(GetMemberResDto, tenants),
    };
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
}
