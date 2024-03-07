import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import Decimal from 'decimal.js';
import { PropertyType } from 'src/libs/constants';
import { AddUnitDto } from 'src/libs/dto';

export const fakeUnit = (
  propertyId: string,
  override: Partial<AddUnitDto> = {},
) => {
  return {
    name: faker.color.human(),
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
    unitFeatures: [],
    ...override,
    propertyId,
  } as AddUnitDto;
};
