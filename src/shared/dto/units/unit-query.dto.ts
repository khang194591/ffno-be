import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { IGetListUnitDto, IGetSimpleListUnitDto } from 'src/libs';
import { DecimalNumber, TransformArray } from 'src/shared/decorators';
import { GetListDto } from '../common';

export class GetListUnitDto extends GetListDto implements IGetListUnitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @TransformArray()
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @TransformArray()
  features?: string[];

  @IsOptional()
  @IsDecimal()
  @Type(() => String)
  minArea?: DecimalNumber;

  @IsOptional()
  @IsDecimal()
  @Type(() => String)
  maxArea?: DecimalNumber;

  @IsOptional()
  @IsDecimal()
  @Type(() => String)
  minPrice?: DecimalNumber;

  @IsOptional()
  @IsDecimal()
  @Type(() => String)
  maxPrice?: DecimalNumber;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxSlot?: number;
}

export class GetSimpleListUnitDto implements IGetSimpleListUnitDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;
}
