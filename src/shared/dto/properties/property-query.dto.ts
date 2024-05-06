import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { PropertyType } from 'src/libs';
import { TransformArray } from 'src/shared/decorators';
import { GetListQueryDto } from '../common';

export class GetListPropertyQueryDto extends GetListQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type?: PropertyType;

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
}
