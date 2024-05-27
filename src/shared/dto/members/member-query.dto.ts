import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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
  @IsEnum(ContactType)
  type?: ContactType;
}
