import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { CreateContractDto } from 'src/shared/dto';
import { ContractService } from '../contract.service';

export class CreateContractCommand {
  constructor(public readonly data: CreateContractDto) {}
}

@CommandHandler(CreateContractCommand)
export class CreateContractHandler
  implements ICommandHandler<CreateContractCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractService: ContractService,
  ) {}

  async execute(query: CreateContractCommand): Promise<string> {
    const data = await this.contractService.validateContractInput(query.data);

    const contract = await this.prisma.contract.create({ data });

    return contract.id;
  }
}
