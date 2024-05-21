import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { MemberResDto } from 'src/shared/dto';
import { MemberService } from '../member.service';
import { validate } from 'class-validator';

export class GetMemberQuery {
  constructor(
    public readonly id: string,
    public readonly currentMember: MemberResDto,
  ) {}
}

@QueryHandler(GetMemberQuery)
export class GetMemberHandler implements IQueryHandler<GetMemberQuery> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly memberService: MemberService,
  ) {}

  async execute({ id, currentMember }: GetMemberQuery): Promise<MemberResDto> {
    const member = await this.prismaService.member.findUnique({
      where: { id },
      include: {
        unit: { select: { name: true } },
        tenantContracts: {
          include: {
            unit: { include: { property: { select: { name: true } } } },
            tenant: true,
          },
          where: {
            landlordId: currentMember.id,
          },
        },
      },
    });

    return plainToInstance(MemberResDto, member);
  }
}
