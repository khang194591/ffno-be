import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IGetListEquipmentDto, UnitStatus } from 'src/libs';

export class GetListEquipmentQuery implements IGetListEquipmentDto {
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
