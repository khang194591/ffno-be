import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ContactType } from 'src/libs';
import { GetListQueryDto } from '../common';

export class GetListContactQueryDto extends GetListQueryDto {
  @IsOptional()
  @IsNotEmpty()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type?: ContactType;
}
