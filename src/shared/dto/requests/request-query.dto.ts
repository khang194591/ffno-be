import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IGetListRequestDto, RequestCategory, RequestStatus } from 'src/libs';
import { GetListDto } from '../common';

export class GetListRequestDto
  extends GetListDto
  implements IGetListRequestDto
{
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(RequestCategory)
  category?: RequestCategory;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}
