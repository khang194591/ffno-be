import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { MaintainStatus } from 'src/libs/constants';
import { DecimalNumber } from 'src/libs/decorators';
import { Nullable } from '../common';
import { GetMemberResDto } from '../members';

@Exclude()
export class GetUnitResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  @Type(() => DecimalNumber)
  area: DecimalNumber;

  @Expose()
  @Type(() => DecimalNumber)
  price: DecimalNumber;

  @Expose()
  @Type(() => DecimalNumber)
  deposit: DecimalNumber;

  @Expose()
  details: Nullable<string>;

  @Expose()
  maintainStatus: MaintainStatus;

  @Expose()
  beds: string;

  @Expose()
  baths: string;

  @Expose()
  parking: string;

  @Expose()
  laundry: string;

  @Expose()
  airConditioning: string;

  @Expose()
  @Transform(({ value }) => value?.map(({ name }) => name))
  unitFeatures: string[];

  @Expose()
  tenants: GetMemberResDto[];

  @Expose()
  payer: GetMemberResDto;
}
