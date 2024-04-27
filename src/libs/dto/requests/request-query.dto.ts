import { IsOptional, IsString } from 'class-validator';
import { GetListQueryDto } from '../common';

export class GetListRequestQueryDto extends GetListQueryDto {
  @IsOptional()
  @IsString()
  type?: string;
}
