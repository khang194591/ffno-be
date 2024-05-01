import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UnitStatus } from 'src/shared';
import { DecimalNumber } from 'src/libs/decorators';
import { Nullable } from '../common';
import { MemberResDto } from '../members';
import { GetPropertyResDto } from '../properties';

@Exclude()
export class UnitResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  isListing: boolean;

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
  @Type(() => MemberResDto)
  tenants: MemberResDto[];

  @Expose()
  @Type(() => MemberResDto)
  payer: MemberResDto;

  @Expose()
  @Type(() => GetPropertyResDto)
  property: GetPropertyResDto;

  @Expose()
  propertyId: string;
}
