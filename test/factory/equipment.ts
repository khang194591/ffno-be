import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';
import { MaintainStatus } from 'src/shared';
import { CreateEquipmentDto } from 'src/shared/decorators';
import { v4 } from 'uuid';

export const fakeEquipment = (override: Partial<CreateEquipmentDto> = {}) => {
  return {
    id: v4(),
    name: faker.word.sample(),
    brand: faker.word.sample(),
    model: faker.word.sample(),
    serial: faker.word.sample(),
    details: faker.word.sample(),
    price: new Decimal(faker.number.int({ min: 1_000_000, max: 10_000_000 })),
    maintainStatus: MaintainStatus.GOOD,
    dateOfInstallation: faker.date.past(),
    enableWarranty: true,
    warrantyExpirationDate: faker.date.future(),
    ...override,
  } as CreateEquipmentDto;
};
