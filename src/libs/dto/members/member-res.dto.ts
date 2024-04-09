import { Exclude, Expose, Transform } from 'class-transformer';
import { MemberRole } from 'src/libs/constants';

@Exclude()
export class GetMemberResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  imgUrl: string;

  @Expose()
  role: MemberRole;

  @Expose()
  @Transform(({ value }) => value?.name)
  unit: string;
}
