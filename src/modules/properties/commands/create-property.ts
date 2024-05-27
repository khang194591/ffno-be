import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { CreatePropertyDto } from 'src/shared/dto';
import { PropertyService } from '../property.service';

export class CreatePropertyCommand {
  constructor(public readonly data: CreatePropertyDto) {}
}

@CommandHandler(CreatePropertyCommand)
export class CreatePropertyHandler
  implements ICommandHandler<CreatePropertyCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async execute(query: CreatePropertyCommand): Promise<string> {
    const data = await this.propertyService.validateCreatePropertyInput(
      query.data,
    );

    const property = await this.prisma.property.create({
      data: data as Prisma.PropertyCreateInput,
    });

    return property.id;
  }
}
