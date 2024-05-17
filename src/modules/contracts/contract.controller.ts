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
import { CurrentMember } from 'src/shared/decorators';
import {
  CreateContractDto,
  GetListContractDto,
  IdNumberParams,
  MemberResDto,
  UpdateContractDto,
} from 'src/shared/dto';
import { CreateContractCommand, UpdateContractCommand } from './commands';
import { GetContractQuery, GetListContractQuery } from './queries';

@Controller('contracts')
@ApiTags('Contracts')
export class ContractController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getListContract(
    @CurrentMember() currentMember: MemberResDto,
    @Query() query: GetListContractDto,
  ) {
    return this.queryBus.execute(
      new GetListContractQuery(currentMember, query),
    );
  }

  @Get(':id')
  async getContract(@Param() { id }: IdNumberParams) {
    return this.queryBus.execute(new GetContractQuery(id));
  }

  @Post()
  async createContract(
    @CurrentMember() currentMember: MemberResDto,
    @Body() body: CreateContractDto,
  ) {
    return this.commandBus.execute(
      new CreateContractCommand(currentMember, body),
    );
  }

  @Patch(':id')
  async updateContract(
    @CurrentMember() currentMember: MemberResDto,
    @Body() body: UpdateContractDto,
    @Param() { id }: IdNumberParams,
  ) {
    return this.commandBus.execute(
      new UpdateContractCommand(currentMember, id, body),
    );
  }
}
