import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMemberId } from 'src/shared/decorators';
import {
  CreateRequestDto,
  GetListRequestQueryDto,
  IdUUIDParams,
  UpdateRequestDto,
} from 'src/shared/dto';
import { CreateRequestCommand, UpdateRequestCommand } from './commands';
import { GetListRequestQuery, GetRequestQuery } from './queries';

@Controller('requests')
@ApiTags('Requests')
export class RequestController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getListRequest(
    @CurrentMemberId() staffId: string,
    @Query() query: GetListRequestQueryDto,
  ) {
    return this.queryBus.execute(new GetListRequestQuery(staffId, query));
  }

  @Get(':id')
  async getRequest(@Param() { id }: IdUUIDParams) {
    return this.queryBus.execute(new GetRequestQuery(id));
  }

  @Post()
  async createRequest(
    @CurrentMemberId() staffId: string,
    @Body() body: CreateRequestDto,
  ) {
    return this.commandBus.execute(new CreateRequestCommand(staffId, body));
  }

  @Patch(':id')
  async updateRequest(
    @CurrentMemberId() memberId: string,
    @Body() body: UpdateRequestDto,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.commandBus.execute(
      new UpdateRequestCommand(memberId, { id, status: body.status }),
    );
  }
}
