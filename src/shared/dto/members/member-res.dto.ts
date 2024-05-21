import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Gender,
  IContractResDto,
  ICurrentMemberResDto,
  IMemberResDto,
  MemberRole,
} from 'src/libs';
import { ContractResDto } from '../contracts';
import { TransformArray } from 'src/shared/decorators';

@Exclude()
export class MemberResDto implements IMemberResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  gender: Gender;

  @Expose()
  address: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  imgUrl: string;

  @Expose()
  role: MemberRole;

  @Expose()
  @Transform(
    ({ value }) =>
      value?.name + (value?.property?.name ? ` - ${value.property.name}` : ''),
  )
  unit: string;

  @Expose()
  @TransformArray()
  @Type(() => ContractResDto)
  tenantContracts: IContractResDto[];
}

@Exclude()
export class CurrentMemberResDto
  extends MemberResDto
  implements ICurrentMemberResDto
{
  @Expose()
  identityNumber: string;

  @Expose()
  identityImgUrls: string;
}
