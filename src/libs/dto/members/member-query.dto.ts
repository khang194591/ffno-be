import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { MemberContactType } from 'src/libs/constants';
import { GetListQueryDto } from '../common';

export class GetListContactQueryDto extends GetListQueryDto {
  @IsOptional()
  @IsNotEmpty()
  keyword?: string;

  @IsNumber()
  @Type(() => Number)
  type: number = MemberContactType.TENANT;
}
