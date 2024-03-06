import { Body, Controller, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from 'src/libs/dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async createProperty(@Body() body: CreatePropertyDto) {
    return this.propertyService.createProperty(body);
  }
}
