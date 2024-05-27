import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetListResDto, GetListReviewDto, ReviewResDto } from 'src/shared/dto';

export class GetListReviewQuery {
  constructor(public readonly data: GetListReviewDto) {}
}

@QueryHandler(GetListReviewQuery)
export class GetListReviewHandler implements IQueryHandler<GetListReviewQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListReviewQuery,
  ): Promise<GetListResDto<ReviewResDto>> {
    const {
      data: { unitId, memberId, propertyId, take, skip },
    } = query;

    const where: Prisma.ReviewWhereInput = {
      unitId,
      memberId,
      propertyId,
    };

    const [total, reviews] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        take,
        skip,
        include: { author: { select: { id: true, name: true, imgUrl: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      data: plainToInstance(ReviewResDto, reviews),
    };
  }
}
