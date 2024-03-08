import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdUUIDParams } from 'src/common/dto';
import { CreateUnitDto, UpdateUnitDto } from 'src/libs/dto';
import { UnitService } from './unit.service';

@Controller('units')
@ApiTags('Units', 'Properties')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  async getUnits() {
    return this.unitService.getUnits();
  }

  @Get(':id')
  async getUnit(@Param() { id }: IdUUIDParams) {
    return this.unitService.getUnitOrThrow(id);
  }

  @Post(':id/units')
  async addUnit(@Param() { id }: IdUUIDParams, @Body() body: CreateUnitDto) {
    return this.unitService.createUnit({ ...body, propertyId: id });
  }

  @Patch(':id')
  async updateUnit(@Param() { id }: IdUUIDParams, @Body() body: UpdateUnitDto) {
    return this.unitService.updateUnit(id, { ...body, id: id });
  }

  @Delete(':id')
  async deleteUnit(@Param() { id }: IdUUIDParams) {
    return this.unitService.deleteUnit(id);
  }
}
