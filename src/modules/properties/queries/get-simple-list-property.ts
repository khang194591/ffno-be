import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { GetListResDto, GetPropertyResDto } from 'src/libs/dto';

export class GetSimpleListPropertyQuery {
  constructor(public readonly staffId: string) {}
}

@QueryHandler(GetSimpleListPropertyQuery)
export class GetSimpleListPropertyHandler
  implements IQueryHandler<GetSimpleListPropertyQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetSimpleListPropertyQuery,
  ): Promise<GetListResDto<GetPropertyResDto>> {
    const { staffId } = query;

    const where: Prisma.PropertyWhereInput = {
      ownerId: staffId,
    };

    const [total, properties] = await this.prisma.$transaction([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return {
      total,
      data: plainToInstance(GetPropertyResDto, properties),
    };
  }
}
