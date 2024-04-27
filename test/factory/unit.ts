import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';
import { MaintainStatus, PropertyType } from 'src/libs/constants';
import { CreateUnitDto } from 'src/libs/dto';
import { v4 } from 'uuid';

export const fakeUnit = (
  propertyId: string,
  override: Partial<CreateUnitDto> = {},
) => {
  return {
    id: v4(),
    name: faker.string.alpha(12),
    type: PropertyType.SINGLE_UNIT,
    area: new Decimal(faker.number.int({ min: 10, max: 200 })),
    price: new Decimal(faker.number.int({ min: 1_000_000, max: 20_000_000 })),
    deposit: new Decimal(faker.number.int({ min: 1_000_000, max: 20_000_000 })),
    details: faker.lorem.sentence(),
    beds: '1',
    baths: 'SHARED',
    parking: 'FREE',
    laundry: 'NONE',
    airConditioning: 'COLD',
    maintainStatus: MaintainStatus.GOOD,
    unitFeatures: [],
    ...override,
    propertyId,
  } as CreateUnitDto;
};
