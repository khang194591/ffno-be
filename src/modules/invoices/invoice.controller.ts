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
  CreateInvoiceDto,
  GetListInvoiceQueryDto,
  IdUUIDParams,
  UpdateInvoiceDto,
} from 'src/libs/dto';
import { CreateInvoiceCommand, UpdateInvoiceCommand } from './commands';
import { GetListInvoiceQuery } from './queries';
import { StaffId } from 'src/libs/decorators';

@Controller('invoices')
@ApiTags('Invoices')
export class InvoiceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getListInvoice(
    @StaffId() staffId: string,
    @Query() query: GetListInvoiceQueryDto,
  ) {
    return this.queryBus.execute(new GetListInvoiceQuery(staffId, query));
  }

  @Post()
  async createInvoice(@Body() body: CreateInvoiceDto) {
    return this.commandBus.execute(new CreateInvoiceCommand(body));
  }

  @Patch(':id')
  async updateInvoice(
    @Body() body: UpdateInvoiceDto,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.commandBus.execute(new UpdateInvoiceCommand(id, body));
  }
}
