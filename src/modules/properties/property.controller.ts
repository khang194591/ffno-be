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
  CreatePropertyDto,
  GetListPropertyQueryDto,
  IdUUIDParams,
  UpdatePropertyDto,
} from 'src/libs/dto';
import {
  CreatePropertyCommand,
  DeletePropertyCommand,
  UpdatePropertyCommand,
} from './commands';
import {
  GetListPropertyQuery,
  GetListTenantQuery,
  GetPropertyQuery,
  GetSimpleListPropertyQuery,
} from './queries';

@Controller('properties')
@ApiTags('Properties')
export class PropertyController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getProperties(
    @StaffId() staffId: string,
    @Query() query: GetListPropertyQueryDto,
  ) {
    return this.queryBus.execute(new GetListPropertyQuery(staffId, query));
  }

  @Get('simple-list')
  async getSimpleListProperty(@StaffId() staffId: string) {
    return this.queryBus.execute(new GetSimpleListPropertyQuery(staffId));
  }

  @Get(':id')
  async getProperty(@Param() { id }: IdUUIDParams) {
    return this.queryBus.execute(new GetPropertyQuery(id));
  }

  @Get(':id/tenants')
  async getTenants(@Param() { id }: IdUUIDParams) {
    return this.queryBus.execute(new GetListTenantQuery(id));
  }

  @Post()
  async createProperty(@Body() body: CreatePropertyDto) {
    return this.commandBus.execute(new CreatePropertyCommand(body));
  }

  @Patch(':id')
  async updateProperty(
    @Body() body: UpdatePropertyDto,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.commandBus.execute(new UpdatePropertyCommand(id, body));
  }

  @Delete(':id')
  async deleteProperty(@Param() { id }: IdUUIDParams) {
    return this.commandBus.execute(new DeletePropertyCommand(id));
  }
}
