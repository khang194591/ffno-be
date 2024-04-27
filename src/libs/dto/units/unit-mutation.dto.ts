import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { UnitStatus } from 'src/shared';
import { DecimalNumber } from 'src/libs/decorators';

export class CreateUnitDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsDecimal()
  @Type(() => String)
  area: DecimalNumber;

  @IsDecimal()
  @Type(() => String)
  price: DecimalNumber;

  @IsDecimal()
  @Type(() => String)
  deposit: DecimalNumber;

  @IsEnum(UnitStatus)
  @Type(() => Number)
  status: UnitStatus;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls: string[];

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

export class OpenUnitDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  unitIds: string[];
}
