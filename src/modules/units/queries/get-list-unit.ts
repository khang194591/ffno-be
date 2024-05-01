import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  GetListResDto,
  GetListUnitQueryDto,
  GetPropertyResDto,
} from 'src/libs/dto';

export class GetListUnitQuery {
  constructor(public readonly data: GetListUnitQueryDto) {}
}

@QueryHandler(GetListUnitQuery)
export class GetListUnitHandler implements IQueryHandler<GetListUnitQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListUnitQuery,
  ): Promise<GetListResDto<GetPropertyResDto>> {
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
    const whereUnit: Prisma.UnitWhereInput = {
      name: {
        search: name,
      },
      isListing: true,
      unitFeatures: features && { some: { name: { in: features } } },
      area: { gte: minArea, lte: maxArea },
      price: { gte: minPrice, lte: maxPrice },
    };

    const whereProperty: Prisma.PropertyWhereInput = {
      name: {
        search: name,
      },
      ward,
      district,
      province,
      amenities: amenities && { some: { name: { in: amenities } } },
    };

    const [total, units] = await this.prisma.$transaction([
      this.prisma.property.count({
        where: {
          ...whereProperty,
          units: {
            some: whereUnit,
          },
        },
      }),
      this.prisma.property.findMany({
        take,
        skip,
        where: {
          ...whereProperty,
          units: {
            some: whereUnit,
          },
        },
        include: {
          units: {
            where: whereUnit,
          },
        },
      }),
    ]);

    return { total, data: plainToInstance(GetPropertyResDto, units) };
  }
}
