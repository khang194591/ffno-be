import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ContactType, IGetListContactDto } from 'src/libs';
import { GetListDto } from '../common';

export class GetListContactDto
  extends GetListDto
  implements IGetListContactDto
{
  @IsOptional()
  @IsNotEmpty()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type?: ContactType;
}
