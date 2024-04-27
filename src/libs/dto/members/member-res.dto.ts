import { Exclude, Expose, Transform } from 'class-transformer';
import { MemberRole } from 'src/libs/constants';

@Exclude()
export class MemberResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  gender: string;

  @Expose()
  address: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  imgUrl: string;

  @Expose()
  role: MemberRole;

  @Expose()
  @Transform(({ value }) => value?.name)
  unit: string;
}

@Exclude()
export class CurrentMemberResDto extends MemberResDto {
  @Expose()
  identityNumber: string;

  @Expose()
  identityImgUrls: string;
}
