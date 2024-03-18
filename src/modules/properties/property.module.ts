import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

@Module({
  imports: [CqrsModule],
  controllers: [PropertyController],
  providers: [PropertyService, ...CommandHandlers, ...QueryHandlers],
  exports: [PropertyService],
})
export class PropertyModule {}
