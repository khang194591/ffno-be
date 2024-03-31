import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { InvoiceCategory } from 'src/libs/constants';

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

  @IsEnum(InvoiceCategory)
  @Type(() => Number)
  category: InvoiceCategory;

  @IsArray()
  @IsUUID('4', { each: true })
  receiverIds: string[];
}

export class UpdateRequestDto extends PartialType(CreateRequestDto) {}
