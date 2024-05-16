import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs';
import {
  ContractResDto,
  GetListContractDto,
  GetListResDto,
  MemberResDto,
} from 'src/shared/dto';

export class GetListContractQuery {
  constructor(
    public readonly currentMember: MemberResDto,
    public readonly data: GetListContractDto,
  ) {}
}

@QueryHandler(GetListContractQuery)
export class GetListContractHandler
  implements IQueryHandler<GetListContractQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListContractQuery,
  ): Promise<GetListResDto<ContractResDto>> {
    const {
      currentMember,
      data: { take, skip, status, unitId, tenantId, landlordId },
    } = query;

    const where: Prisma.ContractWhereInput = { status, unitId };

    switch (currentMember.role) {
      case MemberRole.ADMIN:
        break;
      case MemberRole.LANDLORD:
        where.landlordId = currentMember.id;
        where.tenantId = tenantId;
        break;
      case MemberRole.TENANT:
        where.landlordId = landlordId;
        where.tenantId = currentMember.id;
      default:
        break;
    }

    const [total, contracts] = await this.prisma.$transaction([
      this.prisma.contract.count({ where }),
      this.prisma.contract.findMany({
        where,
        take,
        skip,
        include: {
          unit: { select: { id: true, name: true } },
          landlord: { select: { id: true, name: true, imgUrl: true } },
          tenant: { select: { id: true, name: true, imgUrl: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      total,
      data: plainToInstance(ContractResDto, contracts),
    };
  }
}
