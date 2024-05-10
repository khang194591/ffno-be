import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IGetListInvoiceDto, InvoiceStatus } from 'src/libs';
import { TransformArray } from 'src/shared/decorators';
import { GetListDto } from '../common';

export class GetListInvoiceDto
  extends GetListDto
  implements IGetListInvoiceDto
{
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @TransformArray()
  categories?: string[];

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  unitId?: string;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsUUID()
  memberId?: string;
}
