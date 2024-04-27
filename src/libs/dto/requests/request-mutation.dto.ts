import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { RequestCategory, RequestStatus } from 'src/shared';

export class CreateRequestDto {
  constructor(partial: Partial<CreateRequestDto>) {
    Object.assign(this, partial);
  }

  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  details: string;

  @IsEnum(RequestCategory)
  @Type(() => Number)
  category: RequestCategory;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  receiverIds: string[];

  @IsOptional()
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsUUID()
  unitId: string;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsEnum(RequestStatus)
  status: RequestStatus;
}
