import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPropertyResDto } from 'src/libs/dto';
import { PropertyService } from '../property.service';

export class GetPropertyQuery {
  constructor(public readonly data: string) {}
}

@QueryHandler(GetPropertyQuery)
export class GetPropertyHandler implements IQueryHandler<GetPropertyQuery> {
  constructor(private readonly propertyService: PropertyService) {}

  async execute(query: GetPropertyQuery): Promise<GetPropertyResDto> {
    return this.propertyService.getPropertyOrThrow(query.data);
  }
}
