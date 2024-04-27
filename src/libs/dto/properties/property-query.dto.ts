import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransformArray } from 'src/libs/decorators';
import { GetListQueryDto } from '../common';
import { PropertyType } from 'src/shared';

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
