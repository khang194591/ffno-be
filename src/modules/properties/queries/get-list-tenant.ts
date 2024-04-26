import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetListResDto, MemberResDto } from 'src/libssss/dto';

export class GetListTenantQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetListTenantQuery)
export class GetListTenantHandler implements IQueryHandler<GetListTenantQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListTenantQuery,
  ): Promise<GetListResDto<MemberResDto>> {
    const { id } = query;
    const units = await this.prisma.unit.findMany({
      where: { propertyId: id },
      select: {
        name: true,
        tenants: {
          select: {
            id: true,
            name: true,
            phone: true,
            imgUrl: true,
            address: true,
          },
        },
      },
    });

    const tenants = units.flatMap((unit) =>
      unit.tenants.map((tenant) => ({ ...tenant, unit })),
    );

    return {
      total: tenants.length,
      data: plainToInstance(MemberResDto, tenants),
    };
  }
}
