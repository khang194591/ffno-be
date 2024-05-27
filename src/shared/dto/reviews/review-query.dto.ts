import { IsOptional, IsUUID } from 'class-validator';
import { IGetListReviewDto } from 'src/libs';
import { GetListDto } from '../common';

export class GetListReviewDto extends GetListDto implements IGetListReviewDto {
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  unitId?: string;
}
