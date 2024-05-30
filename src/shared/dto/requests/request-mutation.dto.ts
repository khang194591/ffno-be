import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ICreateRequestDto,
  IUpdateRequestDto,
  RequestCategory,
  RequestStatus,
} from 'src/libs';

export class CreateRequestDto implements ICreateRequestDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(RequestCategory)
  category: RequestCategory;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  receiverIds: string[];

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  unitId?: string;

  @IsOptional()
  @IsNumber()
  contractId?: number;

  @IsOptional()
  @IsUUID()
  equipmentId?: string;
}

export class UpdateRequestDto implements IUpdateRequestDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsEnum(RequestStatus)
  status: RequestStatus;
}
