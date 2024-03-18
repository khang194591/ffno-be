import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { UnitService } from '../unit.service';

export class DeleteUnitCommand {
  constructor(public readonly data: string) {}
}

@CommandHandler(DeleteUnitCommand)
export class DeleteUnitHandler implements ICommandHandler<DeleteUnitCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitService: UnitService,
  ) {}

  async execute(query: DeleteUnitCommand): Promise<string> {
    const { data: id } = query;
    await this.unitService.getUnitOrThrow(id);
    await this.prisma.unit.delete({ where: { id } });

    return id;
  }
}
