import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config';
import { CreateRequestDto } from 'src/libs/dto';
import { RequestService } from '../request.service';

export class CreateRequestCommand {
  constructor(public readonly data: CreateRequestDto) {}
}

@CommandHandler(CreateRequestCommand)
export class CreateRequestHandler
  implements ICommandHandler<CreateRequestCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestService: RequestService,
  ) {}

  async execute(query: CreateRequestCommand): Promise<string> {
    const data = await this.requestService.validateRequestInput(query.data);

    const request = await this.prisma.request.create({
      data: data as Prisma.RequestCreateInput,
    });

    return request.id;
  }
}
