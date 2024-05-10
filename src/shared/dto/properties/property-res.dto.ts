import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IPropertyResDto, PropertyType } from 'src/libs';
import { Nullable } from '../common';
import { MemberResDto } from '../members';
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
  details: Nullable<string>;

  @Expose()
  ownerId: Nullable<string>;

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
