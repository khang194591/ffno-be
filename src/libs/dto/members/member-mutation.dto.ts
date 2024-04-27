import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Gender } from 'src/shared';

export class AddTenantDto {
  @IsEmail()
  email: string;

  @IsMobilePhone()
  phone: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: string;

  @IsNotEmpty()
  identityNumber: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  identityImgUrls?: string[] = [];
}

export class UpdateMemberProfileDto {}
