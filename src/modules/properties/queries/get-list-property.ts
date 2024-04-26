import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  GetListPropertyQueryDto,
  GetListResDto,
  GetPropertyResDto,
} from 'src/libssss/dto';

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
      name: name && { search: name.split(' ').join(' | ') },
    };

    const [total, properties] = await this.prisma.$transaction([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        take,
        skip,
        include: {
          amenities: true,
          units: { include: { tenants: { select: { id: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      data: plainToInstance(GetPropertyResDto, properties),
    };
  }
}
