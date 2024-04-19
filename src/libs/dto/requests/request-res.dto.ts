import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { RequestCategory, RequestStatus } from 'src/libs/constants';
import { MemberResDto } from '../members';
import { UnitResDto } from '../units';

@Exclude()
class MemberWithStatus {
  @Expose()
  status: RequestStatus;

  @Expose()
  member: MemberResDto;

  @Expose()
  updatedAt: Date;
}

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
  @Type(() => MemberWithStatus)
  receivers: MemberWithStatus[];

  @Expose()
  receiverIds: string[];

  @Expose()
  @Transform(({ obj }) =>
    obj.receivers
      .filter((i) => i.status === RequestStatus.ACCEPTED)
      .map((receiver) => receiver.member),
  )
  approvers: MemberResDto[];

  @Expose()
  @Transform(({ obj }) =>
    obj.receivers
      .filter((i) => i.status === RequestStatus.ACCEPTED)
      .map((receiver) => receiver.member.id),
  )
  approverIds: string[];

  @Expose()
  createdAt: Date;
}
