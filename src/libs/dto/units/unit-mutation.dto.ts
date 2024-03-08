import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUnitDto {
  @IsOptional()
  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  type: number;

  @IsDecimal()
  area: number;

  @IsDecimal()
  price: number;

  @IsDecimal()
  deposit: number;

  @IsNumber()
  maintainStatus: number;

  @IsOptional()
  @IsString()
  details: string;

  @IsString()
  beds: string;

  @IsString()
  baths: string;

  @IsString()
  parking: string;

  @IsString()
  laundry: string;

  @IsString()
  airConditioning: string;

  @IsArray()
  @IsString({ each: true })
  unitFeatures: string[];

  @IsUUID('4')
  propertyId: string;
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
