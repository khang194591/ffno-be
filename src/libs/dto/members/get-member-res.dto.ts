import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetMemberResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
