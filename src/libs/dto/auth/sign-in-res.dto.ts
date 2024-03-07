import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
