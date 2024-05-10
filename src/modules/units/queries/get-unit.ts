import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { RequestCategory } from 'src/libs';
import { MemberResDto, UnitResDto } from 'src/shared/dto';
import { UnitService } from '../unit.service';

export class GetUnitQuery {
  constructor(
    public readonly member: MemberResDto,
    public readonly unitId: string,
  ) {}
}

@QueryHandler(GetUnitQuery)
export class GetUnitHandler implements IQueryHandler<GetUnitQuery> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitService: UnitService,
  ) {}

  async execute(query: GetUnitQuery): Promise<UnitResDto> {
    const { member, unitId } = query;

    const unit = await this.prisma.unit.findUniqueOrThrow({
      where: { id: unitId },
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

    let requested: boolean = false;

    if (member && member.id) {
      requested = !!(await this.prisma.request.findFirst({
        where: {
          unitId: unitId,
          category: RequestCategory.UNIT_LEASE,
          senderId: member.id,
        },
      }));
    }

    return plainToInstance(UnitResDto, { ...unit, requested });
  }
}
