import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  GetListResDto,
  GetListUnitQueryDto,
  GetUnitResDto,
} from 'src/libs/dto';

export class GetListUnitQuery {
  constructor(public readonly data: GetListUnitQueryDto) {}
}

@QueryHandler(GetListUnitQuery)
export class GetListUnitHandler implements IQueryHandler<GetListUnitQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListUnitQuery,
  ): Promise<GetListResDto<GetUnitResDto>> {
    const {
      name,
      ward,
      district,
      province,
      amenities,
      features,
      minArea,
      maxArea,
      minPrice,
      maxPrice,
      take,
      skip,
    } = query.data;
    const where: Prisma.UnitWhereInput = {
      name,
      unitFeatures: features && { some: { name: { in: features } } },
      property: {
        ward,
        district,
        province,
        amenities: amenities && { some: { name: { in: amenities } } },
      },
      area: { gte: minArea, lte: maxArea },
      price: { gte: minPrice, lte: maxPrice },
    };
    const [total, units] = await this.prisma.$transaction([
      this.prisma.unit.count({ where }),
      this.prisma.unit.findMany({
        where,
        take,
        skip,
        include: {
          payer: {
            select: {
              id: true,
              name: true,
            },
          },
          unitFeatures: true,
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              ward: true,
              district: true,
              province: true,
            },
          },
        },
      }),
    ]);

    return { total, data: plainToInstance(GetUnitResDto, units) };
  }
}
