import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class AddUnitDto {
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
