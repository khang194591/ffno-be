import { Exclude, Expose, Type } from 'class-transformer';
import { GetMemberResDto } from '../members';

@Exclude()
export class GetRequestResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: number;

  @Expose()
  @Type(() => GetMemberResDto)
  sender: GetMemberResDto;

  @Expose()
  senderId: string;

  @Expose()
  @Type(() => GetMemberResDto)
  receiver: GetMemberResDto;

  @Expose()
  receiverId: string;
}
