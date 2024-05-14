import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/shared/decorators';
import { GetListContactDto, IdUUIDParams } from 'src/shared/dto';
import {
  GetCurrentMemberQuery,
  GetListContactQuery,
  GetMemberQuery,
} from './queries';

@Controller('members')
@ApiTags('Members')
export class MemberController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('contacts')
  async getContacts(
    @CurrentMemberId() staffId: string,
    @Query() query: GetListContactDto,
  ) {
    return this.queryBus.execute(new GetListContactQuery(staffId, query));
  }

  @Get('me')
  async getCurrentMember(@CurrentMemberId() memberId: string) {
    return this.queryBus.execute(new GetCurrentMemberQuery(memberId));
  }

  @Get(':id')
  async getMember(@Param() { id }: IdUUIDParams) {
    return this.queryBus.execute(new GetMemberQuery(id));
  }
}
