import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import {
  ICreatePropertyDto,
  ICreateSimpleUnitDto,
  IUpdatePropertyDto,
  PropertyType,
} from 'src/libs';

class CreateSimpleUnitDto implements ICreateSimpleUnitDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxSlot: number;

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

export class CreatePropertyDto implements ICreatePropertyDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(PropertyType)
  type: PropertyType;

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

export class UpdatePropertyDto implements IUpdatePropertyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

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
}
