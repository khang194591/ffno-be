import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/config';
import { MemberRole } from 'src/libs';
import {
  GetListContactQueryDto,
  GetListResDto,
  MemberResDto,
} from 'src/shared/dto';

export class GetListContactQuery {
  constructor(
    public readonly staffId: string,
    public readonly data: GetListContactQueryDto,
  ) {}
}

@QueryHandler(GetListContactQuery)
export class GetListContactHandler
  implements IQueryHandler<GetListContactQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListContactQuery,
  ): Promise<GetListResDto<MemberResDto>> {
    const {
      staffId,
      data: { type, keyword, skip, take },
    } = query;

    const where: Prisma.MemberContactsWhereInput = {
      type,
      contactId: staffId,
      contactWith: keyword && {
        OR: [
          { name: { search: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          { phone: { contains: keyword } },
        ],
      },
    };

    const [total, members] = await this.prisma.$transaction([
      this.prisma.memberContacts.count({ where }),
      this.prisma.memberContacts.findMany({
        skip,
        take,
        where,
        select: {
          contactWith: {
            include: {
              unit: type === MemberRole.TENANT && {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    const contacts = members.map((member) =>
      plainToClass(MemberResDto, member.contactWith),
    );

    return { total, data: contacts };
  }
}
