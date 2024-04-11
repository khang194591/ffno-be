import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/libs/decorators';
import { GetListContactQueryDto, IdUUIDParams } from 'src/libs/dto';
import { LinkTenantCommand } from './commands';
import { GetListContactQuery, GetMemberQuery } from './queries';

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

  @Get(':id')
  async getMember(@Param() { id }: IdUUIDParams) {
    return this.queryBus.execute(new GetMemberQuery(id));
  }

  @Post('link-tenant')
  async linkTenant(
    @CurrentMemberId() staffId: string,
    @Body() { keyword }: { keyword: string },
  ) {
    return this.commandBus.execute(new LinkTenantCommand(staffId, keyword));
  }
}
