import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import Decimal from 'decimal.js';
import { Gender, MaintainStatus, PropertyType } from '../src/libs/constants';
import { v4 } from 'uuid';

function getRandomItemsInArray<T = unknown>(array: Array<T>) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randomInt(array.length - 1));
}

const mockAmenities = Array(randomInt(10, 50))
  .fill(0)
  .map(() => faker.animal.type());

const mockUnitFeatures = Array(randomInt(10, 50))
  .fill(0)
  .map(() => faker.animal.type());

const fakeMember = (override = {}) => {
  return {
    id: v4(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    gender: Gender.MALE,
    password: '@Password.123',
    address: faker.location.streetAddress(),
    dateOfBirth: faker.date.past(),
    identityNumber: faker.string.alphanumeric(12),
    imgUrl: faker.internet.url(),
    ...override,
  };
};

const fakeProperty = (ownerId: string) => {
  return {
    id: v4(),
    name: faker.color.human() + ' ' + faker.internet.password(),
    type: PropertyType.MULTIPLE_UNIT,
    address: faker.location.streetAddress(),
    ward: faker.string.alpha(4),
    district: faker.string.alpha(4),
    province: faker.string.alpha(4),
    imgUrls: [faker.internet.url(), faker.internet.url()],
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
    name: faker.color.human() + ' ' + faker.company.buzzNoun(),
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
    prisma.invoice.deleteMany(),
    prisma.invoiceCategory.deleteMany(),
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

  await prisma.invoiceCategory.createMany({
    data: ['Unit charge', 'Maintain fee'].map((name) => ({ name })),
  });

  await prisma.requestCategory.createMany({
    data: ['Lease'].map((name) => ({ name })),
  });

  const admin = await prisma.member.create({
    data: fakeMember({
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
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
    .map(({ id }) =>
      Array(randomInt(5))
        .fill(0)
        .map(() => fakeUnit(id)),
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
