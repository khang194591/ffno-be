import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransformArray } from 'src/libssss/decorators';
import { GetListQueryDto } from '../common';

export class GetListUnitQueryDto extends GetListQueryDto {
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
  @IsNumber()
  @Type(() => Number)
  minArea?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxArea?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;
}

export class GetSimpleListUnitQueryDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;
}
