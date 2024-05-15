import { Exclude, Expose, Transform, Type } from 'class-transformer';
import Decimal from 'decimal.js';
import {
  IInvoiceItemResDto,
  IInvoiceResDto,
  InvoiceCategory,
  InvoiceStatus,
} from 'src/libs';
import { DecimalNumber } from 'src/shared/decorators';
import { Nullable } from '../common';
import { MemberResDto } from '../members';
import { UnitResDto } from '../units';

@Exclude()
class InvoiceItemResDto implements IInvoiceItemResDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => DecimalNumber)
  price: DecimalNumber;

  @Expose()
  @Type(() => DecimalNumber)
  amount: DecimalNumber;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }) => Decimal.mul(obj.price, obj.amount))
  total: DecimalNumber;
}

@Exclude()
export class InvoiceResDto implements IInvoiceResDto {
  @Expose()
  id: string;

  @Expose()
  status: InvoiceStatus;

  @Expose()
  @Type(() => DecimalNumber)
  total: DecimalNumber;

  @Expose()
  paidAt: Nullable<Date>;

  @Expose()
  dueDate: Date;

  @Expose()
  details: string;

  @Expose()
  category: InvoiceCategory;

  @Expose()
  unitId: string;

  @Expose()
  @Type(() => UnitResDto)
  unit: UnitResDto;

  @Expose()
  memberId: string;

  @Expose()
  @Type(() => MemberResDto)
  member: MemberResDto;

  @Expose()
  @Type(() => InvoiceItemResDto)
  items: InvoiceItemResDto[];
}
