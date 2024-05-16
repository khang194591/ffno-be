/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { randomInt } from 'node:crypto';
import { v4 } from 'uuid';
import {
  ContractStatus,
  Gender,
  MemberRole,
  PropertyType,
  UnitStatus,
} from '../../src/libs';
import districts from '../../src/static/districts.json';
import provinces from '../../src/static/provinces.json';
import wards from '../../src/static/wards.json';

export function getRandomEnumValue<T>(enumeration: T): T[keyof T] {
  const values = Object.values(enumeration);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as T[keyof T];
}

export function getRandomItemsInArray<T = unknown>(array: Array<T>) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randomInt(array.length - 1));
}

export function getRandomItemInArray<T = unknown>(array: T[]): T {
  if (array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export const mockAmenities = [
  'Swimming pool',
  'Gym',
  'Playground',
  'Tennis court',
  'Roof terrace or garden',
  'Coffee shop',
  'Laundry service',
  'BBQ area',
  "Children's play area",
  'High-speed internet access',
  'Property management service',
  'Parking lot',
  'Bar/lounge',
  'Meeting room',
  'Outdoor party area',
  'Babysitting service',
  'Pet-friendly',
  'Babysitting service',
];

export const mockUnitFeatures = [
  'Air conditioning',
  'Refrigerator',
  'Washing machine',
  'Bathtub',
  'Wardrobe',
  'Desk',
  'Internet',
  'Dining table',
  'Balcony',
  'Heater',
  'Hair dryer',
  'Bed',
  'Table and chairs',
  'Extractor hood',
  'Oven',
  'Backup generator',
  'Water purifier',
  'Water heater',
];

const fakePropertyImgUrls = [
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-binyamin-mellish-106399.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-binyamin-mellish-1396132.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-curtis-adams-3555615.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-jens-mahnke-1105754.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-164522.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-209315.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-210538.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-210617.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-221540.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-259588.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-276593.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-277667.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-280222.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-280229.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-460695.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-thgusstavo-santana-2102587.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-vlad-bagacian-1212053.jpg',
];

const fakeUnitImgUrls = [
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-atbo-245208.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-colour-creation-112811.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-emma-pollard-1534924.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-jean-van-der-meulen-1457842.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-medhat-ayad-439227.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-210265.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-259962.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-265004.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-271624.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-pixabay-271816.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-tom-swinnen-2249959.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-vecislavas-popa-1571453.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-vecislavas-popa-1571459.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-vecislavas-popa-1571468.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-vecislavas-popa-1643383.jpg',
  'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/pexels-vika-glitter-1648768.jpg',
];

export const fakeMember = (override = {}) => {
  const gender = getRandomEnumValue(Gender);
  // @ts-ignore
  const firstName = faker.person.firstName(gender.toLowerCase());
  // @ts-ignore
  const lastName = faker.person.lastName(gender.toLowerCase());

  return {
    id: v4(),
    name: `${lastName} ${firstName}`,
    email: faker.internet.email({ lastName, firstName }),
    phone: faker.phone.number(),
    gender,
    password: '$2b$10$rfTZt.T4aWlqfAtl5VPFWeIGGYKzhwIp.Cz8utOghQ0doPN9yW7Vm',
    role: MemberRole.TENANT,
    address: faker.location.streetAddress(),
    dateOfBirth: faker.date.past(),
    identityNumber: faker.string.alphanumeric(12).toUpperCase(),
    imgUrl: `https://avatar.iran.liara.run/public/${faker.number.int({ min: 1, max: 100 })}`,
    ...override,
  };
};

export const fakeProperty = (ownerId: string) => {
  const province = getRandomItemInArray(provinces);
  const districtOptions = districts[province];
  const district = getRandomItemInArray<string>(districtOptions);
  const wardOptions = wards[district];
  const ward = getRandomItemInArray<string>(wardOptions);
  const type = getRandomEnumValue(PropertyType);
  return {
    id: v4(),
    name: `${faker.location.buildingNumber()}${faker.string.alpha(1).toUpperCase()}, ${faker.location.street()}`,
    type,
    address: faker.location.streetAddress(true),
    ward,
    district,
    province,
    imgUrls: Array.from({ length: randomInt(2, 6) }).map(() =>
      getRandomItemInArray(fakePropertyImgUrls),
    ),
    ownerId,
    description: faker.lorem.paragraph(),
    amenities: {
      connect: getRandomItemsInArray(mockAmenities).map((name) => ({ name })),
    },
  };
};

export const fakeUnit = (propertyId: string): Prisma.UnitCreateInput => {
  return {
    id: v4(),
    name: `${faker.string.numeric(3)}`,
    area: new Decimal(faker.number.int({ min: 10, max: 200 })),
    price: new Decimal(faker.number.int({ min: 10, max: 200 }) * 100_000),
    deposit: new Decimal(faker.number.int({ min: 10, max: 200 }) * 100_000),
    description: faker.lorem.sentence(),
    status:
      randomInt(100) < 90
        ? UnitStatus.GOOD
        : randomInt(100) < 50
          ? UnitStatus.MAINTAINING
          : UnitStatus.BAD,
    imgUrls: Array.from({ length: randomInt(2, 6) }).map(() =>
      getRandomItemInArray(fakeUnitImgUrls),
    ),
    property: { connect: { id: propertyId } },
    unitFeatures: {
      connect: getRandomItemsInArray(mockUnitFeatures).map((name) => ({
        name,
      })),
    },
  };
};

export const fakeContract = (
  landlordId: string,
  tenantId: string,
  unitId: string,
): Prisma.ContractCreateInput => {
  const startDate =
    randomInt(10) < 8
      ? dayjs(faker.date.past())
      : dayjs().add(1, 'month').startOf('month');
  const endDate = startDate.add(randomInt(6, 36), 'months');
  const terminationDate =
    randomInt(10) < 4
      ? endDate.subtract(randomInt(1, 180), 'days')
      : endDate.isBefore(dayjs())
        ? dayjs(endDate)
        : null;

  return {
    status: (terminationDate || endDate).isBefore(new Date())
      ? ContractStatus.EXPIRED
      : startDate.isBefore(new Date())
        ? ContractStatus.ACTIVE
        : ContractStatus.PENDING,
    unit: { connect: { id: unitId } },
    tenant: { connect: { id: tenantId } },
    landlord: { connect: { id: landlordId } },
    template: 'basic',
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    terminationDate:
      terminationDate && terminationDate.isBefore()
        ? terminationDate.toDate()
        : null,
    imgUrls: [],
  };
};
