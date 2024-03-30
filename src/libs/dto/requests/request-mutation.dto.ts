import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { InvoiceCategory } from 'src/libs/constants';

export class CreateRequestDto {
  constructor(partial: Partial<CreateRequestDto>) {
    Object.assign(this, partial);
  }

  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(InvoiceCategory)
  category: InvoiceCategory;

  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;
}

export class UpdateRequestDto extends PartialType(CreateRequestDto) {}
