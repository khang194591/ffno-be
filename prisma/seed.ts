import { faker } from '@faker-js/faker/locale/vi';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import Decimal from 'decimal.js';
import { v4 } from 'uuid';
import {
  ContactType,
  Gender,
  MemberRole,
  PropertyType,
  UnitStatus,
} from '../src/libs';
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

const fakeMember = (override = {}) => {
  const gender = randomInt(2) === 0 ? Gender.MALE : Gender.FEMALE;
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
  const type =
    randomInt(2) === 0 ? PropertyType.SINGLE_UNIT : PropertyType.MULTIPLE_UNIT;
  return {
    id: v4(),
    name: `Nhà số ${faker.location.buildingNumber()}${faker.string.alpha(1).toUpperCase()}, ${faker.location.street()}`,
    type,
    address: faker.location.streetAddress(true),
    ward,
    district,
    province,
    imgUrls: [
      fakePropertyImgUrls[randomInt(fakePropertyImgUrls.length)],
      fakePropertyImgUrls[randomInt(fakePropertyImgUrls.length)],
    ],
    ownerId,
    details: faker.lorem.paragraph(),
    amenities: {
      connect: getRandomItemsInArray(mockAmenities).map((name) => ({ name })),
    },
  };
};

const fakeUnit = (propertyId: string): Prisma.UnitCreateInput => {
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
      fakeUnitImgUrls[randomInt(fakeUnitImgUrls.length)],
      fakeUnitImgUrls[randomInt(fakeUnitImgUrls.length)],
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
      id: 'eeb06826-843f-4f4f-a298-b1ce3b9a370b',
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.ADMIN,
      name: 'Trịnh Đức Khang',
      imgUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocJ-wyEURnuJjTv_eY9Fgf_KPd4QA75b_A5D06wJ63IB7gKjOUUv=s288-c-no',
    }),
  });

  const members = Array(randomInt(50, 100))
    .fill(0)
    .map(() => fakeMember());

  members.push(
    fakeMember({
      id: '3c8f96f8-57c8-4846-9826-59b1277e9b63',
      email: 'khang.td194591@sis.hust.edu.vn',
      password: hashSync('123456', 10),
      role: MemberRole.TENANT,
      name: 'Trịnh Khang',
      imgUrl: 'https://avatars.githubusercontent.com/u/65625612?s=200&v=4',
    }),
  );

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
        data: {
          contacts: {
            create: { type: ContactType.TENANT, contactWithId: member.id },
          },
        },
      }),
    ]),
  );

  const contacts = await prisma.memberContacts.findMany({});

  await prisma.memberContacts.createMany({
    skipDuplicates: true,
    data: contacts.map((contact) => ({
      type: ContactType.TENANT,
      contactId: contact.contactWithId,
      contactWithId: contact.contactId,
    })),
  });

  await prisma.unit.updateMany({
    data: { isListing: true },
    where: { payerId: null },
  });
};

void seed();
