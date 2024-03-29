import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/config';
import { UpdateRequestDto } from 'src/libs/dto';
import { RequestService } from '../request.service';

export class UpdateRequestCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateRequestDto,
  ) {}
}

@CommandHandler(UpdateRequestCommand)
export class UpdateRequestHandler
  implements ICommandHandler<UpdateRequestCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestService: RequestService,
  ) {}

  async execute(query: UpdateRequestCommand): Promise<string> {
    const { id } = query;
    const data = await this.requestService.validateRequestInput(query.data);

    await this.requestService.getRequestOrThrow(id);

    const request = await this.prisma.request.update({ where: { id }, data });

    return request.id;
  }
}
