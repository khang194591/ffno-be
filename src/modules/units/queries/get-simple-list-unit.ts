import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetListResDto, GetUnitResDto } from 'src/libs/dto';

export class GetSimpleListUnitQuery {
  constructor(
    public readonly staffId: string,
    public readonly propertyId?: string,
  ) {}
}

@QueryHandler(GetSimpleListUnitQuery)
export class GetSimpleListUnitHandler
  implements IQueryHandler<GetSimpleListUnitQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetSimpleListUnitQuery,
  ): Promise<GetListResDto<GetUnitResDto>> {
    const { staffId, propertyId } = query;
    const where: Prisma.UnitWhereInput = {
      property: { id: propertyId, ownerId: staffId },
    };
    const [total, units] = await this.prisma.$transaction([
      this.prisma.unit.count({ where }),
      this.prisma.unit.findMany({
        where,
        select: {
          id: true,
          name: true,
          tenants: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    return { total, data: plainToInstance(GetUnitResDto, units) };
  }
}
