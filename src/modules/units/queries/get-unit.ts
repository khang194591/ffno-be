import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUnitResDto } from 'src/libs/dto';
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

  async execute(query: GetUnitQuery): Promise<GetUnitResDto> {
    const { data } = query;

    const unit = await this.prisma.unit.findUniqueOrThrow({
      where: { id: data },
      include: {
        payer: true,
        tenants: true,
        unitFeatures: true,
      },
    });

    return plainToInstance(GetUnitResDto, unit);
  }
}
