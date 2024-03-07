import { PartialType } from '@nestjs/swagger';
import { AddUnitDto } from './add-unit.dto';

export class UpdateUnitDto extends PartialType(AddUnitDto) {}
