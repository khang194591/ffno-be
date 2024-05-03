import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnitResDto } from 'src/libs/dto';
import { UnitService } from '../unit.service';
import { PrismaService } from 'src/config';
import { plainToInstance } from 'class-transformer';

export class GetUnitQuery {
  constructor(public readonly data: string) {}
}

@QueryHandler(GetUnitQuery)
export class GetUnitHandler implements IQueryHandler<GetUnitQuery> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitService: UnitService,
  ) {}

  async execute(query: GetUnitQuery): Promise<UnitResDto> {
    const { data } = query;

    const unit = await this.prisma.unit.findUniqueOrThrow({
      where: { id: data },
      include: {
        payer: true,
        tenants: true,
        unitFeatures: true,
        property: {
          select: {
            name: true,
            address: true,
            ward: true,
            district: true,
            province: true,
          },
        },
      },
    });

    return plainToInstance(UnitResDto, unit);
  }
}
