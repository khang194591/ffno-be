import { Exclude, Expose, Type } from 'class-transformer';
import { GetMemberResDto } from '../members';
import { RequestCategory, RequestStatus } from 'src/libs/constants';

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
  @Type(() => GetMemberResDto)
  sender: GetMemberResDto;

  @Expose()
  senderId: string;

  @Expose()
  @Type(() => GetMemberResDto)
  receivers: GetMemberResDto[];

  @Expose()
  receiverIds: string[];
}
