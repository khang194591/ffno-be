import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetRequestResDto } from 'src/libssss/dto';

export class GetRequestQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetRequestQuery)
export class GetRequestHandler implements IQueryHandler<GetRequestQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: GetRequestQuery): Promise<GetRequestResDto> {
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

    return plainToInstance(GetRequestResDto, request);
  }
}
