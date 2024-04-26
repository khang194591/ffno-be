import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { UpdateUnitDto } from 'src/libssss/dto';
import { UnitService } from '../unit.service';

export class UpdateUnitCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateUnitDto,
  ) {}
}

@CommandHandler(UpdateUnitCommand)
export class UpdateUnitHandler implements ICommandHandler<UpdateUnitCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitService: UnitService,
  ) {}

  async execute(query: UpdateUnitCommand): Promise<string> {
    const { id, data } = query;
    await this.unitService.getUnitOrThrow(id);
    await this.unitService.validateUnit(data);

    const unit = await this.prisma.unit.update({
      where: { id },
      data: {
        ...data,
        unitFeatures: { connect: data.unitFeatures?.map((name) => ({ name })) },
      },
    });

    return unit.id;
  }
}
