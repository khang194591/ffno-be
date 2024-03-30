import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UnitStatus } from 'src/libs/constants';

export class CreateUnitDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsDecimal()
  area: number;

  @IsDecimal()
  price: number;

  @IsDecimal()
  deposit: number;

  @IsEnum(UnitStatus)
  status: UnitStatus;

  @IsOptional()
  @IsString()
  details: string;

  @IsArray()
  @IsString({ each: true })
  unitFeatures: string[];

  @IsUUID()
  propertyId: string;
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
