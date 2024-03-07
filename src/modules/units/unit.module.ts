import { Module } from '@nestjs/common';
import { PropertyModule } from '../properties/property.module';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [PropertyModule],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
