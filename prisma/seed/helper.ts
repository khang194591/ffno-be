/* eslint-disable @typescript-eslint/ban-ts-comment */
import { faker } from '@faker-js/faker/locale/vi';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import { randomInt } from 'node:crypto';
import { v4 } from 'uuid';
import { Gender, MemberRole, PropertyType, UnitStatus } from '../../src/libs';
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

export const mockAmenities = [
  'Hồ bơi',
  'Phòng tập gym',
  'Khu vui chơi',
  'Sân tennis',
  'Sân thượng hoặc vườn mái',
  'Quán cà phê',
  'Dịch vụ giặt là',
  'Khu vực BBQ',
  'Khu vực vui chơi cho trẻ em',
  'Truy cập internet tốc độ cao',
  'Dịch vụ quản lý tài sản',
  'Bãi đậu xe',
  'Quầy bar/lounge',
  'Phòng họp',
  'Khu vực tiệc ngoài trời',
  'Dịch vụ giữ trẻ',
  'Cho phép vật nuôi',
  'Dịch vụ giữ trẻ',
];

export const mockUnitFeatures = [
  'Điều hòa không khí',
  'Tủ lạnh',
  'Máy giặt',
  'Bồn tắm',
  'Tủ quần áo',
  'Bàn làm việc',
  'Internet',
  'Bàn ăn',
  'Ban công',
  'Máy sưởi',
  'Máy sấy tóc',
  'Giường',
  'Bàn và ghế',
  'Máy hút mùi',
  'Lò nướng',
  'Máy phát điện dự phòng',
  'Máy lọc nước',
  'Bình nước nóng',
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
  const province = provinces[randomInt(provinces.length)];
  const districtOptions = districts[province];
  const district = districtOptions[randomInt(districtOptions.length)];
  const wardOptions = wards[district];
  const ward = wardOptions[randomInt(wardOptions.length)];
  const type = getRandomEnumValue(PropertyType);
  return {
    id: v4(),
    name: `Nhà số ${faker.location.buildingNumber()}${faker.string.alpha(1).toUpperCase()}, ${faker.location.street()}`,
    type,
    address: faker.location.streetAddress(true),
    ward,
    district,
    province,
    imgUrls: Array(randomInt(2, 6))
      .fill(0)
      .map(() => fakePropertyImgUrls[randomInt(fakePropertyImgUrls.length)]),
    ownerId,
    details: faker.lorem.paragraph(),
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
    details: faker.lorem.sentence(),
    status:
      randomInt(100) < 90
        ? UnitStatus.GOOD
        : randomInt(100) < 50
          ? UnitStatus.MAINTAINING
          : UnitStatus.BAD,
    imgUrls: Array(randomInt(2, 6))
      .fill(0)
      .map(() => fakeUnitImgUrls[randomInt(fakeUnitImgUrls.length)]),
    property: { connect: { id: propertyId } },
    unitFeatures: {
      connect: getRandomItemsInArray(mockUnitFeatures).map((name) => ({
        name,
      })),
    },
  };
};
