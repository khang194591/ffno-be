import { Exclude, Expose, Type } from 'class-transformer';
import {
  ContractStatus,
  IContractResDto,
  IMemberResDto,
  IRequestResDto,
  IUnitResDto,
  RequestStatus,
} from 'src/libs';
import { DecimalNumber } from 'src/shared/decorators';
import { MemberResDto } from '../members';
import { UnitResDto } from '../units';
import { RequestResDto } from '../requests';

@Exclude()
export class ContractResDto implements IContractResDto {
  @Expose()
  id: number;

  @Expose()
  status: ContractStatus;

  @Expose()
  @Type(() => DecimalNumber)
  price: DecimalNumber;

  @Expose()
  @Type(() => DecimalNumber)
  deposit: DecimalNumber;

  @Expose()
  template: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  terminationDate: Date;

  @Expose()
  imgUrls: string[];

  @Expose()
  landlordId: string;

  @Expose()
  @Type(() => MemberResDto)
  landlord: IMemberResDto;

  @Expose()
  landlordStatus: RequestStatus;

  @Expose()
  tenantId: string;

  @Expose()
  @Type(() => MemberResDto)
  tenant: IMemberResDto;

  @Expose()
  tenantStatus: RequestStatus;

  @Expose()
  unitId: string;

  @Expose()
  @Type(() => UnitResDto)
  unit: IUnitResDto;

  @Expose()
  @Type(() => RequestResDto)
  requests: IRequestResDto[];
}
