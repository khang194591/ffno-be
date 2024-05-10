import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { CreateUnitDto } from 'src/shared/dto';
import { UnitService } from '../unit.service';

export class CreateUnitCommand {
  constructor(public readonly data: CreateUnitDto) {}
}

@CommandHandler(CreateUnitCommand)
export class CreateUnitHandler implements ICommandHandler<CreateUnitCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitService: UnitService,
  ) {}

  async execute({ data }: CreateUnitCommand): Promise<string> {
    await this.unitService.validateUnit(data);

    const unit = await this.prisma.unit.create({
      data: {
        ...data,
        unitFeatures: { connect: data.unitFeatures.map((name) => ({ name })) },
      },
    });

    return unit.id;
  }
}
