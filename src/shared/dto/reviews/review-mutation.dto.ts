import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ICreateReviewDto } from 'src/libs';

export class CreateReviewDto implements ICreateReviewDto {
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsUUID()
  memberId?: string;

  @IsOptional()
  @IsUUID()
  unitId?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;
}
