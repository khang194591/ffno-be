import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { RequestResDto } from 'src/shared/dto';

export class GetRequestQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetRequestQuery)
export class GetRequestHandler implements IQueryHandler<GetRequestQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: GetRequestQuery): Promise<RequestResDto> {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        unit: { select: { id: true, name: true } },
        sender: { select: { id: true, name: true, imgUrl: true } },
        receivers: {
          select: {
            status: true,
            member: { select: { id: true, name: true, imgUrl: true } },
            updatedAt: true,
          },
        },
      },
    });

    return plainToInstance(RequestResDto, request);
  }
}
