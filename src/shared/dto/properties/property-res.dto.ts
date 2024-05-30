import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IEquipmentResDto,
  IPropertyResDto,
  IReviewRatingResDto,
  PropertyType,
} from 'src/libs';
import { Nullable } from '../common';
import { EquipmentResDto } from '../equipments';
import { MemberResDto } from '../members';
import { ReviewRatingResDto, ReviewResDto } from '../reviews';
import { UnitResDto } from '../units/unit-res.dto';

@Exclude()
export class GetPropertyResDto implements IPropertyResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: PropertyType;

  @Expose()
  address: string;

  @Expose()
  ward: string;

  @Expose()
  district: string;

  @Expose()
  province: string;

  @Expose()
  imgUrls: string[];

  @Expose()
  description: Nullable<string>;

  @Expose()
  ownerId: Nullable<string>;

  @Expose()
  @Type(() => ReviewRatingResDto)
  rating: IReviewRatingResDto;

  @Expose()
  @Type(() => MemberResDto)
  owner: MemberResDto;

  @Expose()
  @Transform(({ value }) => value?.map(({ name }) => name))
  amenities: string[];

  @Expose()
  @Type(() => UnitResDto)
  units: UnitResDto[];

  @Expose()
  @Type(() => ReviewResDto)
  reviews: ReviewResDto[];

  @Expose()
  @Type(() => EquipmentResDto)
  equipments: IEquipmentResDto[];

  @Expose()
  @Transform(
    ({ obj }) => obj.units?.filter((unit) => unit.tenants?.length).length,
  )
  occupiedCount: number;

  @Expose()
  @Transform(
    ({ obj }) => obj.units?.filter((unit) => !unit.tenants?.length).length,
  )
  vacantCount: number;
}
