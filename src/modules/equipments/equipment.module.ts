import { EquipmentController } from './equipment.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { PropertyModule } from '../properties/property.module';

@Module({
  imports: [PropertyModule],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class EquipmentModule {}
