import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { IGetListPropertyDto, PropertyType } from 'src/libs';
import { TransformArray } from 'src/shared/decorators';
import { GetListDto } from '../common';

export class GetListPropertyDto
  extends GetListDto
  implements IGetListPropertyDto
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PropertyType)
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
