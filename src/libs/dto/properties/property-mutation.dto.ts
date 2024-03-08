import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreatePropertyDto {
  constructor(partial: Partial<CreatePropertyDto>) {
    Object.assign(this, partial);
  }

  @IsOptional()
  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  type: number;

  @IsString()
  address: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls: string[];

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  equipments: string[];

  @IsUUID('4')
  ownerId: string;
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
