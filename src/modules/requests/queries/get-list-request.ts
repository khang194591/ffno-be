import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  GetListRequestQueryDto,
  GetListResDto,
  GetRequestResDto,
} from 'src/libs/dto';

export class GetListRequestQuery {
  constructor(
    public readonly staffId: string,
    public readonly data: GetListRequestQueryDto,
  ) {}
}

@QueryHandler(GetListRequestQuery)
export class GetListRequestHandler
  implements IQueryHandler<GetListRequestQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListRequestQuery,
  ): Promise<GetListResDto<GetRequestResDto>> {
    const {
      staffId,
      data: { take, skip },
    } = query;

    const where: Prisma.RequestWhereInput = {
      receivers: { some: { id: staffId } },
    };

    const [total, requests] = await this.prisma.$transaction([
      this.prisma.request.count({ where }),
      this.prisma.request.findMany({
        where,
        take,
        skip,
        include: {
          receivers: { select: { id: true, name: true } },
          sender: { select: { id: true, name: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      total,
      data: plainToInstance(GetRequestResDto, requests),
    };
  }
}
