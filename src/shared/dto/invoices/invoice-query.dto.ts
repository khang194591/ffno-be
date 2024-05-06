import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { InvoiceStatus } from 'src/libs';
import { TransformArray } from 'src/shared/decorators';
import { GetListQueryDto } from '../common';

export class GetListInvoiceQueryDto extends GetListQueryDto {
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
