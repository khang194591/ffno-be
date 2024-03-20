import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, ...CommandHandlers, ...QueryHandlers],
  exports: [InvoiceService],
})
export class InvoiceModule {}
