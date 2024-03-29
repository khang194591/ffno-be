import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DecimalNumber } from 'src/libs/decorators';

export class CreateInvoiceDto {
  @IsOptional()
  @IsUUID('4')
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

  @IsString()
  category: string;

  @IsUUID('4')
  unitId: string;

  @IsUUID('4')
  memberId: string;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
