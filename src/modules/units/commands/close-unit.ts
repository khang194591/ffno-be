import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';

export class CloseUnitCommand {
  constructor(public readonly unitIds: string[]) {}
}

@CommandHandler(CloseUnitCommand)
export class CloseUnitHandler implements ICommandHandler<CloseUnitCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ unitIds }: CloseUnitCommand): Promise<any> {
    return this.prisma.unit.updateMany({
      where: { id: { in: unitIds } },
      data: { isListing: false },
    });
  }
}
