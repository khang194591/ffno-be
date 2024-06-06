import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IUnitResDto, UnitStatus } from 'src/libs';
import { DecimalNumber } from 'src/shared/decorators';
import { Nullable } from '../common';
import { EquipmentResDto } from '../equipments';
import { MemberResDto } from '../members';
import { GetPropertyResDto } from '../properties';
import { ReviewRatingResDto, ReviewResDto } from '../reviews';

@Exclude()
export class UnitResDto implements IUnitResDto {
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
  description: Nullable<string>;

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

  @Expose()
  requested: boolean;

  @Expose()
  isLiving: boolean;

  @Expose()
  selfOccupied: boolean;

  @Expose()
  @Type(() => ReviewResDto)
  reviews: ReviewResDto[];

  @Expose()
  @Type(() => ReviewRatingResDto)
  rating: ReviewRatingResDto;

  @Expose()
  @Type(() => EquipmentResDto)
  equipments: EquipmentResDto[];
}
