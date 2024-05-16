import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs';
import { CreateContractDto, MemberResDto } from 'src/shared/dto';
import { ContractService } from '../contract.service';

export class CreateContractCommand {
  constructor(
    public readonly currentMember: MemberResDto,
    public readonly data: CreateContractDto,
  ) {}
}

@CommandHandler(CreateContractCommand)
export class CreateContractHandler
  implements ICommandHandler<CreateContractCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractService: ContractService,
  ) {}

  async execute(query: CreateContractCommand): Promise<number> {
    const { currentMember } = query;

    if (currentMember.role === MemberRole.LANDLORD) {
      query.data.landlordId = currentMember.id;
    }

    if (currentMember.role === MemberRole.ADMIN && !query.data.landlordId) {
      throw new BadRequestException('Admin must select landlordId');
    }

    const data = await this.contractService.validateContractInput(query.data);

    const contract = await this.prisma.contract.create({ data });

    return contract.id;
  }
}
