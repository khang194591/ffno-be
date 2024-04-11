import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetRequestResDto } from 'src/libs/dto';

export class GetRequestQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetRequestQuery)
export class GetRequestHandler implements IQueryHandler<GetRequestQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: GetRequestQuery): Promise<GetRequestResDto> {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    return plainToInstance(GetRequestResDto, request);
  }
}
