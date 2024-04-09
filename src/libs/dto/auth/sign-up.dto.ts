import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Gender, MemberRole } from 'src/libs/constants';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @IsEnum(MemberRole)
  role: MemberRole;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
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
  @Length(12, 12, { message: 'Identity number must be exactly 12 digits' })
  identityNumber: string;
}
