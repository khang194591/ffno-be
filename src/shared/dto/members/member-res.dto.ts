import { Exclude, Expose, Transform } from 'class-transformer';
import { ICurrentMemberResDto, IMemberResDto, MemberRole } from 'src/libs';

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
export class CurrentMemberResDto
  extends MemberResDto
  implements ICurrentMemberResDto
{
  @Expose()
  identityNumber: string;

  @Expose()
  identityImgUrls: string;
}
