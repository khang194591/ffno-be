import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationModule } from '../notifications/notification.module';
import { CommandHandlers } from './commands';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, NotificationModule],
  controllers: [ContractController],
  providers: [ContractService, ...CommandHandlers, ...QueryHandlers],
  exports: [ContractService],
})
export class ContractModule {}
