import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  email: string = 'khang194591@gmail.com';

  @IsString()
  password: string = '123456';
}

@Exclude()
export class SignInResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
