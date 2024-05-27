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
import { CurrentMemberId, Public } from 'src/shared/decorators';
import {
  CreateInvoiceDto,
  GetListInvoiceDto,
  IdNumberParams,
  MergeInvoicesDto,
  UpdateInvoiceDto,
} from 'src/shared/dto';
import { CreateInvoiceCommand, UpdateInvoiceCommand } from './commands';
import { MergeInvoicesCommand } from './commands/merge-invoices';
import { GetInvoiceQuery, GetListInvoiceQuery } from './queries';

@Controller('invoices')
@ApiTags('Invoices')
export class InvoiceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getListInvoice(
    @CurrentMemberId() staffId: string,
    @Query() query: GetListInvoiceDto,
  ) {
    return this.queryBus.execute(new GetListInvoiceQuery(staffId, query));
  }

  @Public()
  @Get(':id')
  async getInvoice(@Param() { id }: IdNumberParams) {
    return this.queryBus.execute(new GetInvoiceQuery(id));
  }

  @Post()
  async createInvoice(@Body() body: CreateInvoiceDto) {
    return this.commandBus.execute(new CreateInvoiceCommand(body));
  }

  @Patch('merge')
  async mergeInvoice(@Body() body: MergeInvoicesDto) {
    return this.commandBus.execute(new MergeInvoicesCommand(body));
  }

  @Patch(':id')
  async updateInvoice(
    @Body() body: UpdateInvoiceDto,
    @Param() { id }: IdNumberParams,
  ) {
    return this.commandBus.execute(new UpdateInvoiceCommand(id, body));
  }
}
