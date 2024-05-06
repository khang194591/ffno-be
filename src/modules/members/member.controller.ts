import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMember, CurrentMemberId } from 'src/shared/decorators';
import {
  GetListContactQueryDto,
  IdUUIDParams,
  MemberResDto,
} from 'src/shared/dto';
import { LinkTenantCommand } from './commands';
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
    @Query() query: GetListContactQueryDto,
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

  @Post('link-tenant')
  async linkTenant(
    @CurrentMember() currentMember: MemberResDto,
    @Body() { keyword }: { keyword: string },
  ) {
    return this.commandBus.execute(
      new LinkTenantCommand(currentMember, keyword),
    );
  }
}
