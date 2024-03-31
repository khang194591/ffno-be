import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { GetListQueryDto } from '../common';

export class GetListContactQueryDto extends GetListQueryDto {
  @IsOptional()
  @IsNotEmpty()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type?: number;
}
