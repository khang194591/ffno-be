import { Exclude, Expose, Type } from 'class-transformer';
import {
  ContractStatus,
  IContractResDto,
  IMemberResDto,
  IUnitResDto,
} from 'src/libs';
import { MemberResDto } from '../members';
import { UnitResDto } from '../units';

@Exclude()
export class ContractResDto implements IContractResDto {
  @Expose()
  id: string;

  @Expose()
  status: ContractStatus;

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
  tenantId: string;

  @Expose()
  @Type(() => MemberResDto)
  tenant: IMemberResDto;

  @Expose()
  @Type(() => UnitResDto)
  unitId: string;

  @Expose()
  unit: IUnitResDto;
}
