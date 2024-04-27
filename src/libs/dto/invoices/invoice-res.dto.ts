import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { InvoiceStatus } from 'src/shared';
import { DecimalNumber } from 'src/libs/decorators';
import { Nullable } from '../common';
import { MemberResDto } from '../members';
import { UnitResDto } from '../units';
import Decimal from 'decimal.js';

@Exclude()
class InvoiceItemResDto {
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
export class InvoiceResDto {
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
  category: string;

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
