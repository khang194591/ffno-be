import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { ContractStatus, MemberRole, RequestStatus } from 'src/libs';
import { CreateContractDto } from 'src/shared/dto';

@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  async validateContractInput(
    data: CreateContractDto,
  ): Promise<Prisma.ContractCreateInput> {
    const { unitId, tenantId, landlordId, ...partialContract } = data;

    const tenant = await this.prisma.member.findUnique({
      where: { id: tenantId, role: MemberRole.TENANT },
    });
    if (!tenant) throw new BadRequestException('Tenant not found');

    const landlord = await this.prisma.member.findUnique({
      where: { id: landlordId, role: MemberRole.LANDLORD },
    });
    if (!landlord) throw new BadRequestException('Landlord not found');

    const unit = await this.prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw new BadRequestException('Unit not found');

    const activeContract = await this.prisma.contract.findFirst({
      where: {
        unitId,
        tenantId,
        status: { in: [ContractStatus.ACTIVE, ContractStatus.PENDING] },
      },
    });
    if (activeContract) {
      throw new BadRequestException('Already have active/pending contract');
    }

    return {
      ...partialContract,
      status: RequestStatus.PENDING,
      landlord: { connect: { id: landlordId } },
      tenant: { connect: { id: tenantId } },
      unit: { connect: { id: unitId } },
    };
  }
}
