import { ContractStatus, IGetListContractDto } from 'src/libs';
import { GetListDto } from '../common';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class GetListContractDto
  extends GetListDto
  implements IGetListContractDto
{
  @IsOptional()
  @IsUUID()
  landlordId?: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsUUID()
  unitId?: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
