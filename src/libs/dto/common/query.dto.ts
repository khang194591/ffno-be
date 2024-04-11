import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class IdUUIDParams {
  @IsUUID()
  id: string;
}

export class IdNumberParams {
  @IsNumber()
  id: number;
}

export class GetListQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  get take(): number {
    return this.pageSize;
  }

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}
