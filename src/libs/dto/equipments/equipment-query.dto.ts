import { IsOptional, IsUUID } from 'class-validator';

export class GetListEquipmentQuery {
  @IsOptional()
  @IsUUID('4')
  propertyId: string;
}
