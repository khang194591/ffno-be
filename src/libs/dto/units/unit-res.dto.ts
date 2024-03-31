import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UnitStatus } from 'src/libs/constants';
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
  status: UnitStatus;

  @Expose()
  imgUrls: string[];

  @Expose()
  @Transform(({ value }) => value?.map(({ name }) => name))
  unitFeatures: string[];

  @Expose()
  @Type(() => GetMemberResDto)
  tenants: GetMemberResDto[];

  @Expose()
  @Type(() => GetMemberResDto)
  payer: GetMemberResDto;
}
