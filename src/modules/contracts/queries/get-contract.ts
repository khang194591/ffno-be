import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { ContractResDto } from 'src/shared/dto';

export class GetContractQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetContractQuery)
export class GetContractHandler implements IQueryHandler<GetContractQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: GetContractQuery): Promise<ContractResDto> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        unit: { select: { id: true, name: true } },
        landlord: { select: { id: true, name: true, imgUrl: true } },
        tenant: { select: { id: true, name: true, imgUrl: true } },
      },
    });

    return plainToInstance(ContractResDto, contract);
  }
}
