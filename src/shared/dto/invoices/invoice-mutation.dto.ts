import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ICreateInvoiceDto,
  IInvoiceItemDto,
  IUpdateInvoiceDto,
  InvoiceCategory,
} from 'src/libs';
import { DecimalNumber } from '../../decorators';

class InvoiceItemDto implements IInvoiceItemDto {
  @IsString()
  description: string;

  @IsDecimal()
  @Type(() => String)
  price: DecimalNumber;

  @IsDecimal()
  @Type(() => String)
  amount: DecimalNumber;
}

export class CreateInvoiceDto implements ICreateInvoiceDto {
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsEnum(InvoiceCategory)
  @Type(() => Number)
  category: InvoiceCategory;

  @IsUUID()
  unitId: string;

  @IsUUID()
  memberId: string;

  @IsArray()
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}

export class UpdateInvoiceDto
  extends PartialType(CreateInvoiceDto)
  implements IUpdateInvoiceDto {}
