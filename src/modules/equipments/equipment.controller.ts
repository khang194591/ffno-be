/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, GetListEquipmentQuery } from 'src/libs/dto';
import { IdUUIDParams } from 'src/libs/dto';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  async getEquipments(@Query() query: GetListEquipmentQuery) {
    return this.equipmentService.getEquipments(query);
  }

  @Get(':id')
  async getEquipment(@Param() { id }: IdUUIDParams) {
    return this.equipmentService.getEquipmentOrThrow(id);
  }

  @Post()
  async createEquipment(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.createEquipment(dto);
  }
}
