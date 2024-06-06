import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IGetListEquipmentDto, UnitStatus } from 'src/libs';
import { GetListDto } from '../common';

export class GetListEquipmentQuery
  extends GetListDto
  implements IGetListEquipmentDto
{
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
}
