import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { OpenUnitDto } from 'src/shared/dto';

export class OpenUnitCommand {
  constructor(public readonly data: OpenUnitDto) {}
}

@CommandHandler(OpenUnitCommand)
export class OpenUnitHandler implements ICommandHandler<OpenUnitCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    data: { unitIds, startListingAt, endListingAt },
  }: OpenUnitCommand): Promise<any> {
    let isListing = true;
    if (startListingAt) {
      isListing = false;
    }
    return this.prisma.unit.updateMany({
      where: { id: { in: unitIds } },
      data: { isListing, startListingAt, endListingAt },
    });
  }
}
