import { Exclude, Expose, Type } from 'class-transformer';
import {
  IEquipmentResDto,
  IPropertyResDto,
  IUnitResDto,
  UnitStatus,
} from 'src/libs';
import { DecimalNumber } from 'src/shared/decorators';

@Exclude()
export class EquipmentResDto implements IEquipmentResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  brand: string;

  @Expose()
  @Type(() => DecimalNumber)
  price: DecimalNumber;

  @Expose()
  model: string;

  @Expose()
  serial: string;

  @Expose()
  dateOfInstallation: Date;

  @Expose()
  description: string;

  @Expose()
  maintainStatus: UnitStatus;

  @Expose()
  enableWarranty: boolean;

  @Expose()
  warrantyExpirationDate: Date;

  @Expose()
  property: IPropertyResDto;

  @Expose()
  unit: IUnitResDto;
}
