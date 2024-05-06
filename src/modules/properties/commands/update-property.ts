import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { UpdatePropertyDto } from 'src/shared/dto';
import { PropertyService } from '../property.service';

export class UpdatePropertyCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdatePropertyDto,
  ) {}
}

@CommandHandler(UpdatePropertyCommand)
export class UpdatePropertyHandler
  implements ICommandHandler<UpdatePropertyCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async execute(query: UpdatePropertyCommand): Promise<string> {
    const { id } = query;
    const data = await this.propertyService.validatePropertyInput(query.data);

    await this.propertyService.getPropertyOrThrow(id);

    const property = await this.prisma.property.update({ where: { id }, data });

    return property.id;
  }
}
