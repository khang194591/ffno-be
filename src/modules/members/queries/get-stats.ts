import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';

export class GetStatsQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetStatsQuery)
export class GetStatsHandler implements IQueryHandler<GetStatsQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({ id }: GetStatsQuery): Promise<any> {
    const propertyCount = await this.prismaService.property.count({
      where: { ownerId: id },
    });

    const units = await this.prismaService.unit.findMany({
      where: { property: { ownerId: id } },
      include: { _count: { select: { tenants: true } } },
    });

    const tenantCount = units.reduce((curr, { _count: { tenants } }) => {
      return curr + tenants;
    }, 0);

    return {
      propertyCount,
      unitCount: units.length,
      tenantCount,
    };
  }
}
