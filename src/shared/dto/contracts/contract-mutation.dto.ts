import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Validate,
} from 'class-validator';
import { ICreateContractDto } from 'src/libs';
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
