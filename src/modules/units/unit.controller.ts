import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { StaffId } from 'src/libs/decorators';
import {
  CreateUnitDto,
  GetListUnitQueryDto,
  GetSimpleListUnitQueryDto,
  IdUUIDParams,
  UpdateUnitDto,
} from 'src/libs/dto';
import {
  CreateUnitCommand,
  DeleteUnitCommand,
  UpdateUnitCommand,
} from './commands';
import {
  GetListUnitQuery,
  GetSimpleListUnitQuery,
  GetUnitQuery,
} from './queries';

@Controller('units')
@ApiTags('Units', 'Properties')
export class UnitController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getUnits(@Query() query: GetListUnitQueryDto) {
    return this.queryBus.execute(new GetListUnitQuery(query));
  }

  @Get('simple-list')
  async getSimpleListUnit(
    @StaffId() staffId: string,
    @Query() query: GetSimpleListUnitQueryDto,
  ) {
    return this.queryBus.execute(
      new GetSimpleListUnitQuery(staffId, query.propertyId),
    );
  }

  @Get(':id')
  async getUnit(@Param() { id }: IdUUIDParams) {
    return this.queryBus.execute(new GetUnitQuery(id));
  }

  @Post()
  async createUnit(@Body() body: CreateUnitDto) {
    return this.commandBus.execute(new CreateUnitCommand(body));
  }

  @Patch(':id')
  async updateUnit(@Param() { id }: IdUUIDParams, @Body() body: UpdateUnitDto) {
    return this.commandBus.execute(new UpdateUnitCommand(id, body));
  }

  @Delete(':id')
  async deleteUnit(@Param() { id }: IdUUIDParams) {
    return this.commandBus.execute(new DeleteUnitCommand(id));
  }
}
