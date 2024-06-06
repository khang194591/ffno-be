import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentMemberId } from 'src/shared/decorators';
import {
  CreateEquipmentDto,
  GetListEquipmentQuery,
  IdUUIDParams,
} from 'src/shared/dto';
import { EquipmentService } from './equipment.service';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  async getEquipments(
    @CurrentMemberId() memberId: string,
    @Query() query: GetListEquipmentQuery,
  ) {
    return this.equipmentService.getEquipments(memberId, query);
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
