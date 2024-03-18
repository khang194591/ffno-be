import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PropertyModule } from '../properties/property.module';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [CqrsModule, PropertyModule],
  controllers: [UnitController],
  providers: [UnitService, ...CommandHandlers, ...QueryHandlers],
})
export class UnitModule {}
