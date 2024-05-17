import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Validate,
} from 'class-validator';
import {
  ICreateContractDto,
  IUpdateContractDto,
  RequestStatus,
} from 'src/libs';
import { IsAfterNowConstraint } from 'src/shared/decorators/is-after-now.decorator';

export class CreateContractDto implements ICreateContractDto {
  @IsString()
  template: string;

  @IsDate()
  @Validate(IsAfterNowConstraint)
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls: string[];

  @IsOptional()
  @IsUUID()
  landlordId?: string;

  @IsUUID()
  tenantId: string;

  @IsUUID()
  unitId: string;
}

export class UpdateContractDto implements IUpdateContractDto {
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls?: string[];

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsDate()
  terminationDate?: Date;
}
