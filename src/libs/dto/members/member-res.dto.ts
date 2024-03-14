import { Exclude, Expose, Transform } from 'class-transformer';

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
  @Transform(({ value }) => value?.name)
  unit: string;
}
