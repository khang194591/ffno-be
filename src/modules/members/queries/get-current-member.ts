import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { CurrentMemberResDto } from 'src/shared/dto';

export class GetCurrentMemberQuery {
  constructor(public readonly memberId: string) {}
}

@QueryHandler(GetCurrentMemberQuery)
export class GetCurrentMemberHandler
  implements IQueryHandler<GetCurrentMemberQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute({ memberId }: GetCurrentMemberQuery): Promise<any> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    return plainToInstance(CurrentMemberResDto, member);
  }
}
