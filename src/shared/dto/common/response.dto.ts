import { IGetListResDto } from 'src/libs';

export class GetListResDto<T = unknown> implements IGetListResDto<T> {
  data: T[];
  total: number;
}
