import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { PropertyService } from '../property.service';

export class DeletePropertyCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeletePropertyCommand)
export class DeletePropertyHandler
  implements ICommandHandler<DeletePropertyCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async execute(query: DeletePropertyCommand): Promise<string> {
    const { id } = query;
    await this.propertyService.getPropertyOrThrow(id);
    await this.prisma.property.delete({ where: { id } });

    return id;
  }
}
