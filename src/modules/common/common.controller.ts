import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/libs/decorators';
import { CommonService } from './common.service';

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
  async getProperties() {
    return this.commonService.getProperties();
  }

  @Get('units')
  async getUnits(@Query('propertyId') propertyId: string) {
    return this.commonService.getUnits(propertyId);
  }
}
