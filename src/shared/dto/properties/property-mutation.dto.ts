import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { PropertyType } from 'src/libs';

class CreateSimpleUnitDto {
  @IsString()
  name: string;

  @IsDecimal()
  @Type(() => String)
  area: number;

  @IsDecimal()
  @Type(() => String)
  price: number;

  @IsDecimal()
  @Type(() => String)
  deposit: number;
}

export class CreatePropertyDto {
  constructor(partial: Partial<CreatePropertyDto>) {
    Object.assign(this, partial);
  }

  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @Type(() => Number)
  @IsEnum(PropertyType)
  type: number;

  @IsString()
  address: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  equipments: string[];

  @IsOptional()
  @IsUUID()
  ownerId: string;

  @IsArray()
  @Type(() => CreateSimpleUnitDto)
  units: CreateSimpleUnitDto[];
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
