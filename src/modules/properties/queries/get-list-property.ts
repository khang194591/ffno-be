import {
  GetListPropertyQueryDto,
  GetListResDto,
  GetPropertyResDto,
} from 'src/libs/dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class GetListPropertyQuery {
  constructor(
    public readonly staffId: string,
    public readonly data: GetListPropertyQueryDto,
  ) {}
}

@QueryHandler(GetListPropertyQuery)
export class GetListPropertyHandler
  implements IQueryHandler<GetListPropertyQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListPropertyQuery,
  ): Promise<GetListResDto<GetPropertyResDto>> {
    const {
      staffId,
      data: { name, type, ward, district, province, amenities, take, skip },
    } = query;

    const where: Prisma.PropertyWhereInput = {
      ownerId: staffId,
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
          units: {
            include: { tenants: { select: { id: true } } },
          },
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
}
