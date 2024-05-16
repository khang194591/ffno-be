import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UnitStatus } from 'src/libs';

export class CreateEquipmentDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  model?: string;

  @IsOptional()
  serial?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfInstallation?: string;

  @IsOptional()
  description?: string;

  @IsEnum(UnitStatus)
  maintainStatus: UnitStatus = UnitStatus.GOOD;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsBoolean()
  enableWarranty: boolean = false;

  @IsDate()
  @Type(() => Date)
  warrantyExpirationDate: Date;
}

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}
