import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { Gender } from 'src/libssss/constants';
import { SignUpDto } from 'src/libssss/dto';

export const fakeMember = (override: Partial<SignUpDto> = {}) => {
  return plainToInstance(SignUpDto, {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    gender: Gender.MALE,
    password: '@Password.123',
    address: faker.location.streetAddress(),
    dateOfBirth: faker.date.past(),
    identityNumber: faker.string.alphanumeric(12),
    imgUrl: faker.internet.url(),
    ...override,
  });
};
