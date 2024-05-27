import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Gender, ISignUpDto, MemberRole } from 'src/libs';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto implements ISignUpDto {
  @IsEnum(MemberRole)
  role: MemberRole;

  @IsString()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsUrl()
  imgUrl: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  @Length(12, 12, { message: 'Identity number must be exactly 12 digits' })
  identityNumber: string;
}
