import { IsOptional, IsUUID } from 'class-validator';

export class IdUUIDParams {
  @IsUUID()
  @IsOptional()
  id!: string;
}
