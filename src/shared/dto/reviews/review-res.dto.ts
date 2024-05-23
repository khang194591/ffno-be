import { Exclude, Expose, Type } from 'class-transformer';
import {
  IMemberResDto,
  IPropertyResDto,
  IReviewRatingResDto,
  IReviewResDto,
  IUnitResDto,
} from 'src/libs';

@Exclude()
export class ReviewResDto implements IReviewResDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => Number)
  rating: number;

  @Expose()
  comment?: string;

  @Expose()
  propertyId?: string;

  @Expose()
  property?: IPropertyResDto;

  @Expose()
  unitId?: string;

  @Expose()
  unit?: IUnitResDto;

  @Expose()
  memberId?: string;

  @Expose()
  member?: IMemberResDto;

  @Expose()
  authorId: string;

  @Expose()
  author: IMemberResDto;

  @Expose()
  @Type(() => Date)
  createdAt: Date;
}

@Exclude()
export class ReviewRatingResDto implements IReviewRatingResDto {
  @Expose()
  @Type(() => Number)
  rating: number;

  @Expose()
  ratingMap: Record<number, number>;
}
