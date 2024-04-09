import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { InvoiceCategory } from 'src/libs/constants';
import { DecimalNumber } from 'src/libs/decorators';

export class CreateInvoiceDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsDecimal()
  @Type(() => String)
  amount: DecimalNumber;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsString()
  details: string;

  @IsEnum(InvoiceCategory)
  @Type(() => Number)
  category: InvoiceCategory;

  @IsUUID()
  unitId: string;

  @IsUUID()
  memberId: string;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
