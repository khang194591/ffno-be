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
  from: GetMemberResDto;

  @Expose()
  fromId: string;

  @Expose()
  @Type(() => GetMemberResDto)
  to: GetMemberResDto;

  @Expose()
  toId: string;
}
