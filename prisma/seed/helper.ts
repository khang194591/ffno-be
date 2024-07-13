/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faker } from '@faker-js/faker/locale/vi';
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
import wards from '../../src/static/wards.json';
import equipmentCategories from './data/equipment-category.json';
import propertyAmenities from './data/property-amenities.json';
import unitFeatures from './data/unit-features.json';

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

export { equipmentCategories, propertyAmenities, unitFeatures };

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

export const fakeProperty = (ownerId: string, override?: any) => {
  const province = 'Thành phố Hà Nội';
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
    imgUrls: [],
    ownerId,
    description: faker.lorem.paragraph(),
    amenities: {
      connect: getRandomItemsInArray(propertyAmenities).map((name) => ({
        name,
      })),
    },
    ...override,
  };
};

export const fakeUnit = (
  propertyId: string,
  override?: any,
): Prisma.UnitCreateInput => {
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
    imgUrls: [],
    property: { connect: { id: propertyId } },
    unitFeatures: {
      connect: getRandomItemsInArray(unitFeatures).map((name) => ({
        name,
      })),
    },
    unitPriceLogs: {
      createMany: {
        data: [
          {
            category: 'WATER',
            price: 40000,
            status: 0,
            value: 0,
          },
          {
            category: 'ELECTRICITY',
            price: 4000,
            status: 0,
            value: 0,
          },
        ],
      },
    },
    equipments: {
      createMany: {
        data: [
          {
            name: `Chìa khóa phòng`,
            maintainStatus: 'GOOD',
            serial: faker.string.hexadecimal({ length: 8 }),
            price: 100_000,
            category: 'Chìa khóa',
            propertyId,
            imgUrls: [
              'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/key_tag.jpeg',
            ],
          },
          {
            name: `Chìa khóa ban công`,
            maintainStatus: 'GOOD',
            serial: faker.string.hexadecimal({ length: 8 }),
            price: 100_000,
            category: 'Chìa khóa',
            propertyId,
            imgUrls: [
              'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/key.jpg',
            ],
          },
          {
            name: `Điều khiển điều hòa`,
            maintainStatus: 'GOOD',
            serial: faker.string.hexadecimal({ length: 8 }),
            price: 100_000,
            category: 'Điều khiển',
            propertyId,
            imgUrls: [
              'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/daikin_remote.webp',
            ],
          },
          {
            name: 'Máy điều hòa',
            brand: 'Daikin',
            model: 'FTKM35SVMV',
            category: 'Điều hòa',
            price: 5_000_000,
            dateOfInstallation: faker.date.past({ years: 4 }),
            serial: faker.string.hexadecimal({ length: 8 }),
            description: 'Công nghệ Inverter, công suất 1.5 tấn',
            maintainStatus: 'GOOD',
            enableWarranty: true,
            warrantyExpirationDate: faker.date.future({ years: 4 }),
            propertyId,
            imgUrls: [
              'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/Daikiin-Alira-X-Streamer.jpg',
            ],
          },
        ],
      },
    },
    ...override,
    maxSlot: override?.area ? +(override.area / 10).toFixed(0) : 4,
  };
};

export const fakeContract = (
  landlordId: string,
  tenantId: string,
  unitId: string,
  price: Decimal,
  deposit: Decimal,
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

  const status = (terminationDate || endDate).isBefore(new Date())
    ? ContractStatus.EXPIRED
    : startDate.isBefore(new Date())
      ? ContractStatus.ACTIVE
      : ContractStatus.PENDING;

  return {
    status,
    price,
    deposit,
    unit: { connect: { id: unitId } },
    tenant: { connect: { id: tenantId } },
    tenantStatus: [ContractStatus.ACTIVE, ContractStatus.EXPIRED].includes(
      status,
    )
      ? 'ACCEPTED'
      : 'PENDING',
    landlord: { connect: { id: landlordId } },
    landlordStatus: [ContractStatus.ACTIVE, ContractStatus.EXPIRED].includes(
      status,
    )
      ? 'ACCEPTED'
      : 'PENDING',
    template: 'basic',
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    terminationDate:
      terminationDate && terminationDate.isBefore()
        ? terminationDate.toDate()
        : null,
    imgUrls: [
      'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/hop-dong-thue-nha.png',
    ],
  };
};
