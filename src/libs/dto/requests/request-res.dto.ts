import { Exclude, Expose, Type } from 'class-transformer';
import { RequestCategory, RequestStatus } from 'src/libs/constants';
import { MemberResDto } from '../members';
import { UnitResDto } from '../units';

@Exclude()
export class GetRequestResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  details: number;

  @Expose()
  status: RequestStatus;

  @Expose()
  category: RequestCategory;

  @Expose()
  @Type(() => UnitResDto)
  unit: UnitResDto;

  @Expose()
  @Type(() => MemberResDto)
  sender: MemberResDto;

  @Expose()
  senderId: string;

  @Expose()
  @Type(() => MemberResDto)
  receivers: MemberResDto[];

  @Expose()
  receiverIds: string[];

  @Expose()
  @Type(() => MemberResDto)
  approvers: MemberResDto[];

  @Expose()
  approverIds: string[];

  @Expose()
  createdAt: Date;
}
