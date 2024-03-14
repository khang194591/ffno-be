import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetListUnitQueryDto, IdUUIDParams } from 'src/libs/dto';
import { CreateUnitDto, UpdateUnitDto } from 'src/libs/dto';
import { UnitService } from './unit.service';

@Controller('units')
@ApiTags('Units', 'Properties')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  async getUnits(@Query() query: GetListUnitQueryDto) {
    return this.unitService.getUnits(query);
  }

  @Get(':id')
  async getUnit(@Param() { id }: IdUUIDParams) {
    return this.unitService.getUnitOrThrow(id);
  }

  @Post()
  async createUnit(@Body() body: CreateUnitDto) {
    return this.unitService.createUnit(body);
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
