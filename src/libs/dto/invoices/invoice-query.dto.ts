import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransformArray } from 'src/libs/decorators';
import { GetListQueryDto } from '../common';
import { TransactionStatus } from 'src/libs/constants';

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
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsUUID()
  memberId?: string;
}
