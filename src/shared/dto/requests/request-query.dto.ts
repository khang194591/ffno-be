import { IsOptional, IsString } from 'class-validator';
import { IGetListRequestDto } from 'src/libs';
import { GetListDto } from '../common';

export class GetListRequestDto
  extends GetListDto
  implements IGetListRequestDto
{
  @IsOptional()
  @IsString()
  type?: string;
}
