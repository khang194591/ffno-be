import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { MemberContactType } from 'src/libs/constants';
import { GetListDto } from '../common';

export class GetListContactDto extends GetListDto {
  @IsOptional()
  @IsNotEmpty()
  keyword?: string;

  @IsNumber()
  @Type(() => Number)
  type: number = MemberContactType.TENANT;
}
