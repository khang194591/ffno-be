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
import {
  CreatePropertyDto,
  GetListPropertyDto,
  UpdatePropertyDto,
} from 'src/libs/dto';
import { StaffId } from '../../common/decorators/staff.decorator';
import { PropertyService } from './property.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('properties')
@ApiTags('Properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async getProperties(@StaffId() staffId: string, query: GetListPropertyDto) {
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
}
