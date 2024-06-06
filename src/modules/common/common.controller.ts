import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentMember, Public } from 'src/shared/decorators';
import { CommonService } from './common.service';

import { MemberResDto } from 'src/shared/dto';
import districts from 'src/static/districts.json';
import provinces from 'src/static/provinces.json';
import wards from 'src/static/wards.json';

@Controller('common')
@Public()
@ApiTags('Common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('amenities')
  async getAmenities() {
    return this.commonService.getPropertyAmenities();
  }

  @Get('unit-features')
  async getUnitFeatures() {
    return this.commonService.getUnitFeatures();
  }

  @Get('equipment-categories')
  async getEquipmentCategories() {
    return this.commonService.getEquipmentCategories();
  }

  @Get('provinces')
  async getProvinces() {
    return provinces;
  }

  @Get('districts')
  async getDistricts(@Query('province') province: string) {
    if (!province) return [];
    return districts[province] ?? [];
  }

  @Get('wards')
  async getWards(@Query('district') district: string) {
    if (!district) return [];
    return wards[district] ?? [];
  }

  @Get('properties')
  async getProperties(@CurrentMember() member: MemberResDto) {
    return this.commonService.getProperties({ member });
  }

  @Get('units')
  async getUnits(
    @CurrentMember() member: MemberResDto,
    @Query('propertyId') propertyId: string,
  ) {
    return this.commonService.getUnits({ member, propertyId });
  }

  @Get('equipments')
  async getEquipments(
    @Query('propertyId') propertyId: string,
    @Query('unitId') unitId: string,
  ) {
    return this.commonService.getEquipments({ propertyId, unitId });
  }
}
