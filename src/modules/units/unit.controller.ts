import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { IdUUIDParams } from 'src/common/dto';
import { UpdateUnitDto } from 'src/libs/dto';
import { UnitService } from './unit.service';

@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  async getUnits() {
    return this.unitService.getUnits();
  }

  @Get(':id')
  async getUnit(@Param() param: IdUUIDParams) {
    return this.unitService.getUnit(param.id);
  }

  @Patch(':id')
  async updateUnit(@Param() param: IdUUIDParams, @Body() body: UpdateUnitDto) {
    return this.unitService.updateUnit(param.id, { ...body, id: param.id });
  }

  @Delete(':id')
  async deleteUnit(@Param() param: IdUUIDParams) {
    return this.unitService.deleteUnit(param.id);
  }
}
