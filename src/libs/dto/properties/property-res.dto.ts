import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Nullable } from '../common';
import { GetUnitResDto } from '../units/unit-res.dto';

@Exclude()
export class GetPropertyResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: number;

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
  details: Nullable<string>;

  @Expose()
  ownerId: Nullable<string>;

  @Expose()
  @Transform(({ value }) => value?.map(({ name }) => name))
  amenities: string[];

  @Expose()
  @Type(() => GetUnitResDto)
  units: GetUnitResDto[];
}
