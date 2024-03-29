import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsString()
  category: string;

  @IsUUID()
  fromId: string;

  @IsUUID()
  toId: string;
}

export class UpdateRequestDto extends PartialType(CreateRequestDto) {}
