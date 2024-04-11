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
import { CurrentMemberId } from 'src/libs/decorators';
import {
  CreateUnitDto,
  GetListUnitQueryDto,
  GetSimpleListUnitQueryDto,
  IdUUIDParams,
  OpenUnitDto,
  UpdateUnitDto,
} from 'src/libs/dto';
import {
  CloseUnitCommand,
  CreateUnitCommand,
  DeleteUnitCommand,
  OpenUnitCommand,
  UpdateUnitCommand,
} from './commands';
import {
  GetListUnitQuery,
  GetSimpleListUnitQuery,
  GetUnitQuery,
} from './queries';

@Controller('units')
@ApiTags('Units')
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
    @CurrentMemberId() staffId: string,
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

  @Patch('open')
  async openUnit(@Body() { unitIds }: OpenUnitDto) {
    return this.commandBus.execute(new OpenUnitCommand(unitIds));
  }

  @Patch('close')
  async closeUnit(@Body() { unitIds }: OpenUnitDto) {
    return this.commandBus.execute(new CloseUnitCommand(unitIds));
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
