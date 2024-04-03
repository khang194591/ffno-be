import { faker } from '@faker-js/faker/locale/vi';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import Decimal from 'decimal.js';
import { v4 } from 'uuid';
import { MemberRole, UnitStatus } from '../src/libs/constants';
import districts from '../src/static/districts.json';
import provinces from '../src/static/provinces.json';
import wards from '../src/static/wards.json';

function getRandomItemsInArray<T = unknown>(array: Array<T>) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randomInt(array.length - 1));
}

const mockAmenities = [
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

const mockUnitFeatures = [
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

const fakeMember = (override = {}) => {
  const gender = randomInt(2);
  const firstName = faker.person.firstName(gender ? 'female' : 'male');
  const lastName = faker.person.lastName(gender ? 'female' : 'male');
  const name = `${lastName} ${firstName}`;
  return {
    id: v4(),
    name,
    email: faker.internet.email({ lastName, firstName }),
    phone: faker.phone.number(),
    gender,
    password: '$2b$10$rfTZt.T4aWlqfAtl5VPFWeIGGYKzhwIp.Cz8utOghQ0doPN9yW7Vm',
    role: MemberRole.TENANT,
    address: faker.location.streetAddress(),
    dateOfBirth: faker.date.past(),
    identityNumber: faker.string.alphanumeric(12),
    imgUrl: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
    ...override,
  };
};

const fakeProperty = (ownerId: string) => {
  const province = provinces[randomInt(provinces.length)];
  const districtOptions = districts[province];
  const district = districtOptions[randomInt(districtOptions.length)];
  const wardOptions = wards[district];
  const ward = wardOptions[randomInt(wardOptions.length)];
  const type = randomInt(2);
  return {
    id: v4(),
    name: `Nhà số ${faker.location.buildingNumber()}${faker.string.alpha(1).toUpperCase()}, ${faker.location.street()}`,
    type,
    address: faker.location.streetAddress(true),
    ward,
    district,
    province,
    imgUrls: [
      `https://picsum.photos/id/${randomInt(100)}/200/200`,
      `https://picsum.photos/id/${randomInt(100)}/200/200`,
    ],
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
    name: `Phòng ${faker.string.numeric(3)}`,
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
    imgUrls: [
      `https://picsum.photos/id/${randomInt(100)}/200/200`,
      `https://picsum.photos/id/${randomInt(100)}/200/200`,
    ],
    property: { connect: { id: propertyId } },
    unitFeatures: {
      connect: getRandomItemsInArray(mockUnitFeatures).map((name) => ({
        name,
      })),
    },
  };
};

const seed = async () => {
  const prisma = new PrismaClient();
  await prisma.$transaction([
    prisma.request.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.unitPriceLog.deleteMany(),
    prisma.unitFeature.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.equipmentCategory.deleteMany(),
    prisma.equipment.deleteMany(),
    prisma.propertyAmenity.deleteMany(),
    prisma.property.deleteMany(),
    prisma.memberContacts.deleteMany(),
    prisma.member.deleteMany(),
  ]);

  const admin = await prisma.member.create({
    data: fakeMember({
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.ADMIN,
      name: 'Trịnh Đức Khang',
    }),
  });

  const members = Array(randomInt(50, 100))
    .fill(0)
    .map(() => fakeMember());

  await prisma.member.createMany({
    data: members,
  });

  await prisma.propertyAmenity.createMany({
    skipDuplicates: true,
    data: mockAmenities.map((name) => ({ name })),
  });

  await prisma.unitFeature.createMany({
    skipDuplicates: true,
    data: mockUnitFeatures.map((name) => ({ name })),
  });

  const properties = Array(randomInt(20, 50))
    .fill(0)
    .map(() => fakeProperty(admin.id));

  const units = properties
    .map(({ id, type }) =>
      type
        ? Array(randomInt(2, 10))
            .fill(0)
            .map(() => fakeUnit(id))
        : fakeUnit(id),
    )
    .flatMap((i) => i);

  await prisma.$transaction(
    properties.map((property) => prisma.property.create({ data: property })),
  );
  await prisma.$transaction(
    units.map((unit) => prisma.unit.create({ data: unit })),
  );

  const shuffledMembers = members.sort(() => 0.5 - Math.random());
  await prisma.$transaction(
    shuffledMembers.flatMap((member) => [
      prisma.unit.update({
        where: { id: units[randomInt(units.length - 1)].id },
        data: { payerId: member.id, tenants: { connect: { id: member.id } } },
      }),

      prisma.member.update({
        where: {
          id:
            randomInt(10) < 3
              ? admin.id
              : members[randomInt(members.length - 1)].id,
        },
        data: { contacts: { create: { type: 0, contactWithId: member.id } } },
      }),
    ]),
  );
};

void seed();
