import { IsArray, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreatePropertyDto {
  constructor(partial: Partial<CreatePropertyDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  name: string;

  @IsNumber()
  type: number;

  @IsString()
  address: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsArray()
  @IsUrl({}, { each: true })
  imgUrls: string[];

  @IsArray()
  @IsString({ each: true })
  amenities: string[];
}
