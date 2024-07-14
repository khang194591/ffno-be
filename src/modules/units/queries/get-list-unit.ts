import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs';
import { handleSearchQuery } from 'src/libs/helpers';
import {
  GetListResDto,
  GetListUnitDto,
  GetPropertyResDto,
  MemberResDto,
} from 'src/shared/dto';

export class GetListUnitQuery {
  constructor(
    public readonly currentMember: MemberResDto,
    public readonly query: GetListUnitDto,
  ) {}
}

@QueryHandler(GetListUnitQuery)
export class GetListUnitHandler implements IQueryHandler<GetListUnitQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    currentMember,
    query,
  }: GetListUnitQuery): Promise<GetListResDto<GetPropertyResDto>> {
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
      maxSlot,
      take,
      skip,
    } = query;

    const currentMemberId = currentMember?.id;

    const isTenant = !currentMember || currentMember.role === MemberRole.TENANT;

    const whereUnit: Prisma.UnitWhereInput = {
      // name: { search: handleSearchQuery(name) },
      isListing: isTenant ? true : undefined,
      unitFeatures: features && { some: { name: { in: features } } },
      area: { gte: minArea, lte: maxArea },
      price: { gte: minPrice, lte: maxPrice },
      maxSlot: { lte: maxSlot },
    };

    const whereProperty: Prisma.PropertyWhereInput = {
      name: { search: handleSearchQuery(name) },
      ward,
      district,
      province,
      amenities: amenities && { some: { name: { in: amenities } } },
      ownerId: isTenant ? undefined : currentMemberId,
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
            include: {
              tenants: { select: { id: true } },
            },
          },
        },
      }),
    ]);

    return { total, data: plainToInstance(GetPropertyResDto, units) };
  }
}
