import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IdUUIDParams } from 'src/common/dto';
import { AddUnitDto, CreatePropertyDto, UpdatePropertyDto } from 'src/libs/dto';
import { StaffId } from '../../common/decorators/staff.decorator';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async getProperties(@StaffId() staffId: string) {
    return this.propertyService.getProperties(staffId);
  }

  @Get(':id')
  async getProperty(@Param() params: IdUUIDParams) {
    return this.propertyService.getProperty(params.id);
  }

  @Post()
  async createProperty(@Body() body: CreatePropertyDto) {
    return this.propertyService.createProperty(body);
  }

  @Patch(':id')
  async updateProperty(
    @Body() body: UpdatePropertyDto,
    @Param() params: IdUUIDParams,
  ) {
    return this.propertyService.updateProperty(params.id, {
      ...body,
      id: params.id,
    });
  }

  @Delete(':id')
  async deleteProperty(@Param() params: IdUUIDParams) {
    return this.propertyService.deleteProperty(params.id);
  }

  @Post(':id/units')
  async addUnit(@Param() params: IdUUIDParams, @Body() body: AddUnitDto) {
    return this.propertyService.addUnit({ ...body, propertyId: params.id });
  }
}
