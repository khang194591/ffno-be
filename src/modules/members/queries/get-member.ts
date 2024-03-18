import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MemberService } from '../member.service';
import { GetMemberResDto } from 'src/libs/dto';

export class GetMemberQuery {
  constructor(public readonly data: string) {}
}

@QueryHandler(GetMemberQuery)
export class GetMemberHandler implements IQueryHandler<GetMemberQuery> {
  constructor(private readonly memberService: MemberService) {}

  async execute(query: GetMemberQuery): Promise<GetMemberResDto> {
    return this.memberService.getMemberOrThrow(query.data);
  }
}
