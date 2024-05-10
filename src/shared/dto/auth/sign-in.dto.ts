import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { ISignInDto, ISignInResDto, MemberRole } from 'src/libs';

export class SignInDto implements ISignInDto {
  @IsString()
  @IsEmail()
  email: string = 'khang194591@gmail.com';

  @IsString()
  password: string = '123456';
}

@Exclude()
export class SignInResDto implements ISignInResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: MemberRole;

  @Expose()
  imgUrl: string;
}
