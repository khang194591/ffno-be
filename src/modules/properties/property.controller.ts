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
import { StaffId } from 'src/libs/decorators';
import {
  CreatePropertyDto,
  GetListPropertyDto,
  IdUUIDParams,
  UpdatePropertyDto,
} from 'src/libs/dto';
import { PropertyService } from './property.service';

@Controller('properties')
@ApiTags('Properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async getProperties(
    @StaffId() staffId: string,
    @Query() query: GetListPropertyDto,
  ) {
    return this.propertyService.getProperties(staffId, query);
  }

  @Get(':id')
  async getProperty(@Param() { id }: IdUUIDParams) {
    return this.propertyService.getPropertyOrThrow(id);
  }

  @Post()
  async createProperty(@Body() body: CreatePropertyDto) {
    return this.propertyService.createProperty(body);
  }

  @Patch(':id')
  async updateProperty(
    @Body() body: UpdatePropertyDto,
    @Param() { id }: IdUUIDParams,
  ) {
    return this.propertyService.updateProperty(id, {
      ...body,
      id,
    });
  }

  @Delete(':id')
  async deleteProperty(@Param() { id }: IdUUIDParams) {
    return this.propertyService.deleteProperty(id);
  }

  @Get(':id/tenants')
  async getTenants(@Param() { id }: IdUUIDParams) {
    return this.propertyService.getTenants(id);
  }
}
