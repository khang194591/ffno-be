import { Exclude, Expose, Type } from 'class-transformer';
import { RequestCategory, RequestStatus } from 'src/libs/constants';
import { GetMemberResDto } from '../members';
import { GetUnitResDto } from '../units';

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
  @Type(() => GetUnitResDto)
  unit: GetUnitResDto;

  @Expose()
  @Type(() => GetMemberResDto)
  sender: GetMemberResDto;

  @Expose()
  senderId: string;

  @Expose()
  @Type(() => GetMemberResDto)
  receivers: GetMemberResDto[];

  @Expose()
  receiverIds: string[];

  @Expose()
  @Type(() => GetMemberResDto)
  approvers: GetMemberResDto[];

  @Expose()
  approverIds: string[];

  @Expose()
  createdAt: Date;
}
