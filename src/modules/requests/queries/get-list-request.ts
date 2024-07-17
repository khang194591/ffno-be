import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  GetListRequestDto,
  GetListResDto,
  RequestResDto,
} from 'src/shared/dto';

export class GetListRequestQuery {
  constructor(
    public readonly staffId: string,
    public readonly data: GetListRequestDto,
  ) {}
}

@QueryHandler(GetListRequestQuery)
export class GetListRequestHandler
  implements IQueryHandler<GetListRequestQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListRequestQuery,
  ): Promise<GetListResDto<RequestResDto>> {
    const {
      staffId,
      data: { type = 'received', status, category, take, skip },
    } = query;

    const where: Prisma.RequestWhereInput =
      type === 'received'
        ? { receivers: { some: { memberId: staffId } } }
        : { senderId: staffId };

    where.category = category;
    where.status = status;

    const [total, requests] = await this.prisma.$transaction([
      this.prisma.request.count({ where }),
      this.prisma.request.findMany({
        where,
        take,
        skip,
        include: {
          unit: {
            select: {
              id: true,
              name: true,
              propertyId: true,
              property: { select: { name: true } },
            },
          },
          contract: {
            select: { id: true },
          },
          equipment: {
            select: { id: true, name: true },
          },
          sender: { select: { id: true, name: true, imgUrl: true } },
          receivers: {
            select: {
              status: true,
              member: { select: { id: true, name: true, imgUrl: true } },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      total,
      data: plainToInstance(RequestResDto, requests),
    };
  }
}
