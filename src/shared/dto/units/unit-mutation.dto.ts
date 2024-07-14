import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import {
  ICreateUnitDto,
  IOpenUnitDto,
  IUpdateUnitDto,
  UnitStatus,
} from 'src/libs';
import { DecimalNumber } from 'src/shared/decorators';

export class CreateUnitDto implements ICreateUnitDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxSlot: number;

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
  status: UnitStatus;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  unitFeatures: string[];

  @IsUUID()
  propertyId: string;
}

export class UpdateUnitDto
  extends PartialType(CreateUnitDto)
  implements IUpdateUnitDto {}

export class OpenUnitDto implements IOpenUnitDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  unitIds: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startListingAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endListingAt?: Date;
}
