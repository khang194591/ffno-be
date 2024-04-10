import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';

export class OpenUnitCommand {
  constructor(public readonly unitIds: string[]) {}
}

@CommandHandler(OpenUnitCommand)
export class OpenUnitHandler implements ICommandHandler<OpenUnitCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ unitIds }: OpenUnitCommand): Promise<any> {
    return this.prisma.unit.updateMany({
      where: { id: { in: unitIds } },
      data: { isListing: true },
    });
  }
}
