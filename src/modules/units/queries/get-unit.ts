import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUnitResDto } from 'src/libs/dto';
import { UnitService } from '../unit.service';

export class GetUnitQuery {
  constructor(public readonly data: string) {}
}

@QueryHandler(GetUnitQuery)
export class GetUnitHandler implements IQueryHandler<GetUnitQuery> {
  constructor(private readonly unitService: UnitService) {}

  async execute(query: GetUnitQuery): Promise<GetUnitResDto> {
    return this.unitService.getUnitOrThrow(query.data);
  }
}
