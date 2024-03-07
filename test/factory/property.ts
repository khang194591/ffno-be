import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { PropertyType } from 'src/libs/constants';
import { CreatePropertyDto } from 'src/libs/dto';

export const fakeProperty = (
  ownerId: string,
  override: Partial<CreatePropertyDto> = {},
) => {
  return plainToInstance(CreatePropertyDto, {
    name: faker.color.human(),
    type: PropertyType.MULTIPLE_UNIT,
    address: faker.location.streetAddress(),
    ward: faker.string.alpha(4),
    district: faker.string.alpha(4),
    province: faker.string.alpha(4),
    imgUrls: [faker.internet.url(), faker.internet.url()],
    amenities: [],
    ...override,
    ownerId,
  });
};
