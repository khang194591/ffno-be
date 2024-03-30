import { IsOptional, IsUUID } from 'class-validator';

export class GetListEquipmentQuery {
  @IsOptional()
  @IsUUID()
  propertyId: string;
}
