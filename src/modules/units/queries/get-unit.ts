import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { ContractStatus, RequestCategory } from 'src/libs';
import { calculateRating } from 'src/libs/helpers';
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
        equipments: true,
        reviews: {
          include: {
            author: { select: { id: true, name: true, imgUrl: true } },
          },
        },
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
    let isLiving: boolean = false;

    if (member && member.id) {
      const hasRequested = await this.prisma.request.findFirst({
        where: {
          unitId: unitId,
          category: RequestCategory.UNIT_LEASE,
          senderId: member.id,
        },
      });

      const isContracted = await this.prisma.contract.findFirst({
        where: {
          unitId,
          tenantId: member.id,
          status: { in: [ContractStatus.ACTIVE, ContractStatus.PENDING] },
        },
      });

      requested = !!(hasRequested || isContracted);
      isLiving = !!isContracted;
    }

    const { reviews } = unit;

    return plainToInstance(UnitResDto, {
      ...unit,
      isLiving,
      requested,
      selfOccupied: Boolean(unit.tenants.find((i) => i.id === member.id)),
      rating: calculateRating(reviews),
    });
  }
}
