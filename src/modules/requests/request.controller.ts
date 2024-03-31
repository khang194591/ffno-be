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
import {
  CreateRequestDto,
  GetListRequestQueryDto,
  IdUUIDParams,
  UpdateRequestDto,
} from 'src/libs/dto';
import { CreateRequestCommand, UpdateRequestCommand } from './commands';
import { GetListRequestQuery } from './queries';
import { StaffId } from 'src/libs/decorators';

@Controller('requests')
@ApiTags('Requests')
export class RequestController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getListRequest(
    @StaffId() staffId: string,
    @Query() query: GetListRequestQueryDto,
  ) {
    return this.queryBus.execute(new GetListRequestQuery(staffId, query));
  }

  @Post()
  async createRequest(
    @StaffId() staffId: string,
    @Body() body: CreateRequestDto,
  ) {
    return this.commandBus.execute(new CreateRequestCommand(staffId, body));
  }

  @Patch(':id')
  async updateRequest(
    @Body() body: UpdateRequestDto,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.commandBus.execute(new UpdateRequestCommand(id, body));
  }
}
